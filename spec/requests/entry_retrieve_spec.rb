require 'rails_helper'

describe 'Access via API to add a new entry', type: :request do
  let!(:user) { create(:user) }
  let!(:api_key) { user.create_api_key! }

  let(:body) { JSON.parse(response.body).with_indifferent_access }

  describe 'normal #retrieve' do
    let(:entry_attributes) do
      { first_name: 'Peter', last_name: 'Müller', company_name: 'Launchwerk GmbH' }
    end

    before(:each) do
      VCR.use_cassette('peter_launchwerk') do
        post '/api/v1/entries/retrieve', params: { entry: entry_attributes }, headers: { 'X-API-KEY': api_key }
      end
    end

    it 'allow to add an entry and it resolves it inline' do
      expect(response).to be_successful
      expect(body[:entry][:first_name]).to eq('Peter')
      expect(body[:entry][:email]).to eq('peter@launchwerk.de')
    end

    it 'actually persists the entry' do
      found_entry = Entry.find_by(id: body[:entry][:id])
      expect(found_entry).to be_present
      expect(found_entry.user).to eq(user)
    end
  end


  describe 'special characters #retrieve' do
    let(:entry_attributes) do
      {
        first_name: 'Björn', last_name: 'Schiemann', company_name: 'LemonTec GmbH & Co. KG',
        position: 'Geschäftsführer', urls: [], email: 'bschiemann@lemontec.de'
      }
    end

    before(:each) do
      VCR.use_cassette('special_character_entry_request') do
        post '/api/v1/entries/retrieve', params: { entry: entry_attributes }, headers: { 'X-API-KEY': api_key }
      end
    end

    it 'does not fail with & characters in company name' do
      expect(response).to be_successful
      expect(body[:entry][:first_name]).to eq('Björn')
      expect(body[:entry][:email]).to eq('bschiemann@lemontec.de')
    end
  end
end
