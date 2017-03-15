require 'rails_helper'

describe Api::V1::EntriesController, type: :controller do
  before(:each) { sign_in }

  describe '#create' do
    it 'creates a new entry' do
      post :create, params: { entry: { first_name: 'Peter', last_name: 'Müller', company_name: 'Test GmbH' } }
      expect(Entry.last.first_name).to eq('Peter')
      expect(Entry.last.last_name).to eq('Müller')
    end
  end
end
