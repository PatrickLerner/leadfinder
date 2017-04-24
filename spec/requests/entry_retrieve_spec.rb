require 'rails_helper'
require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = 'spec/fixtures/vcr_cassettes'
  config.hook_into :webmock
  config.ignore_localhost = true
end

describe 'Access via API to add a new entry', type: :request do
  let(:entry_attributes) do
    { first_name: 'Peter', last_name: 'Müller', company_name: 'Launchwerk GmbH' }
  end

  let!(:user) { create(:user) }
  let!(:api_key) { user.create_api_key! }

  let(:body) { JSON.parse(response.body).with_indifferent_access }

  it 'allow to add an entry and it resolves it inline' do
    VCR.use_cassette('peter_launchwerk') do
      post '/api/v1/entries/retrieve', params: { entry: entry_attributes }, headers: { 'X-API-KEY': api_key }
      expect(response).to be_successful
      expect(body[:entry][:first_name]).to eq('Peter')
      expect(body[:entry][:email]).to eq('peter@launchwerk.de')
    end
  end
end
