require 'addressable/uri'

class Company
  class GooglePlacesLookup
    def self.lookup(name)
      lookup = GooglePlacesLookup.new(name)
      lookup.company
    rescue GooglePlaces::RequestDeniedError, GooglePlaces::InvalidRequestError,
           GooglePlaces::RetryError, GooglePlaces::RetryTimeoutError,
           GooglePlaces::UnknownError, GooglePlaces::NotFoundError => e
      raise e if Rails.env.development?
      nil
    end

    attr_accessor :name

    def initialize(name)
      @name = name
    end

    def company
      return nil if spots.empty?
      comp = Company.find_or_initialize_by(name: spots.first[:name], domain: domain)
      return comp if comp.persisted?
      return nil if comp.domain.nil?
      add_addresses(comp, spots)
      comp.save!
      comp
    end

    protected

    def domain
      return @domain if @domain.present?
      spot = spot_with_website(spots)
      return if spot.nil?
      @domain ||= ::Addressable::URI.parse(spot[:website]).domain
    end

    def add_addresses(company, spots)
      spots.each do |spot|
        next if spot[:name] != company.name
        data = spot.as_json.slice('city', 'postal_code', 'country', 'region', 'street', 'street_number')
        data['street_name'] = data.delete('street')
        company.addresses.build(data)
      end
    end

    def spot_with_website(spots)
      spots.find { |spot| spot[:website].present? }
    end

    def spots
      @spots ||= client.spots_by_query(name).map do |spot|
        client.spot(spot[:place_id])
      end
    end

    def client
      @client = GooglePlaces::Client.new(Rails.application.secrets.google_places_api)
    end
  end
end
