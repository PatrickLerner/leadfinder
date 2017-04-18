require 'rails_helper'

describe Api::V1::EntriesController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }
  let!(:user) { create(:user) }
  let!(:api_key) { user.create_api_key! }

  describe 'without api key' do
    it 'fails' do
      post :create, params: { entry: { first_name: 'Peter', last_name: 'Müller', company_name: 'Test GmbH' } }
      expect(response.status).to eq(401)
    end
  end

  describe 'with api key' do
    let(:entry) { Entry.find_by(id: body[:entry][:id]) }

    it 'creates a new entry' do
      @request.headers['X-API-KEY'] = api_key
      post :create, params: { entry: { first_name: 'Peter', last_name: 'Müller', company_name: 'Test GmbH' } }
      expect(entry.user_id).to eq(user.id)
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Müller')
      expect(entry.lists).to be_empty
    end

    it 'signs out after the request' do
      @request.headers['X-API-KEY'] = api_key
      post :create, params: { entry: { first_name: 'Peter', last_name: 'Müller', company_name: 'Test GmbH' } }
      expect(response).to be_successful

      @request.headers['X-API-KEY'] = nil
      post :create, params: { entry: { first_name: 'Peter', last_name: 'Müller', company_name: 'Test 2 GmbH' } }
      expect(response).to_not be_successful
      expect(response.status).to eq(401)
    end
  end
end
