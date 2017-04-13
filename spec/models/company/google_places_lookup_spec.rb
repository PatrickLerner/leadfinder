require 'rails_helper'

describe Company::GooglePlacesLookup, type: :model do
  let(:spots) do
    [
      { name: 'Launchwerk GmbH', place_id: :no_website },
      { name: 'Launchwerk GmbH', place_id: :website },
      { name: 'Launchwerk GmbH', place_id: :no_website_2 }
    ]
  end

  let(:mock_api) do
    api = double
    allow(api).to receive(:spots_by_query) do |name|
      expect(name).to eq('Launchwerk GmbH')
      spots
    end
    allow(api).to receive(:spot) do |ref|
      response = {
        name: 'Launchwerk GmbH',
        street_number: '130',
        street: 'Wendenstraße',
        city: 'Hamburg',
        region: 'Hamburg',
        postal_code: '20537',
        country: 'Germany'
      }
      response.merge!(name: 'Launchfactory', city: 'Baghdad') if ref == :launchfactory
      if ref == :no_website
        response.merge(website: nil, city: 'Darmstadt')
      elsif ref == :no_website_2
        response.merge(website: nil, city: 'Berlin')
      else
        response.merge(website: 'http://launchwerk.de/')
      end
    end
    api
  end

  before(:each) do
    allow(GooglePlaces::Client).to receive(:new) { mock_api }
  end

  it 'correctly returns the comany object with email' do
    company = Company::GooglePlacesLookup.lookup('Launchwerk GmbH')
    expect(company.name).to eq('Launchwerk GmbH')
    expect(company.domain).to eq('launchwerk.de')
  end

  it 'returns nil if google api messes up' do
    exception = GooglePlaces::NotFoundError.new(nil)
    allow(GooglePlaces::Client).to receive(:new).and_raise(exception)
    company = Company::GooglePlacesLookup.lookup('Launchwerk GmbH')
    expect(company).to be_nil
  end

  it 'adds addresses' do
    company = Company::GooglePlacesLookup.lookup('Launchwerk GmbH')
    expect(company.addresses.pluck(:city).sort).to eq(%w(Berlin Darmstadt Hamburg))
  end

  it 'only saves addresses of exactly matching company names' do
    spots << { name: 'Launchfactory 2000', place_id: :launchfactory }
    company = Company::GooglePlacesLookup.lookup('Launchwerk GmbH')
    expect(company.addresses.pluck(:city).sort).to eq(%w(Berlin Darmstadt Hamburg))
  end
end
