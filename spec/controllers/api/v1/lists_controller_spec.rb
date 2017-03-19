require 'rails_helper'

describe Api::V1::ListsController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  let(:user) { create(:user) }
  before(:each) { sign_in_as(user) }

  describe '#create' do
    it 'creates a new list' do
      post :create, params: { list: { name: 'New customers' } }
      list = List.find_by(id: body[:id])
      expect(list.user).to eq(user)
      expect(list.name).to eq('New customers')
    end
  end
end
