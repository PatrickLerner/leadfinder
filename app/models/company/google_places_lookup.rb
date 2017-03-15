require 'addressable/uri'

class Company
  class GooglePlacesLookup
    def self.lookup(name)
      spot = spot_with_website(find_spots(name))
      return nil if spot.nil?
      domain = ::Addressable::URI.parse(spot[:website]).domain
      Company.find_or_create_by!(name: spot[:name], domain: domain)
    rescue GooglePlaces::RequestDeniedError, GooglePlaces::InvalidRequestError,
           GooglePlaces::RetryError, GooglePlaces::RetryTimeoutError,
           GooglePlaces::UnknownError, GooglePlaces::NotFoundError => e
      raise e if Rails.env.development?
      nil
    end

    def self.spot_with_website(spots)
      spots.each do |spot|
        details = spot_details(spot)
        return details if details[:website].present?
      end
      nil
    end

    def self.spot_details(spot)
      client.spot(spot[:place_id])
    end

    def self.find_spots(name)
      client.spots_by_query(name)
    end

    def self.client
      # TODO : FIX ME
      @client = GooglePlaces::Client.new(Rails.application.secrets.google_places_api)
    end
  end
end
