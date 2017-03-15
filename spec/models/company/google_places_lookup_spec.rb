require 'rails_helper'

describe Company::GooglePlacesLookup, type: :model do
  let(:spots) do
    [
      { name: 'Launchwerk', reference: :no_website },
      { name: 'Launchwerk GmbH', reference: :website }
    ]
  end

  let(:mock_api) do
    api = double
    allow(api).to receive(:spots_by_query) do |name|
      expect(name).to eq('Launchwerk GmbH')
      spots
    end
    allow(api).to receive(:spot) do |ref|
      if ref == :no_website
        { name: 'Launchwerk GmbH', website: nil }
      else
        { name: 'Launchwerk GmbH', website: 'http://launchwerk.de/' }
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
    allow(Company::GooglePlacesLookup).to receive(:find_spots).and_raise(exception)
    company = Company::GooglePlacesLookup.lookup('Launchwerk GmbH')
    expect(company).to be_nil
  end
end
