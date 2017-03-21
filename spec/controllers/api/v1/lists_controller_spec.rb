require 'rails_helper'

describe Api::V1::ListsController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  let(:user) { create(:user) }
  before(:each) { sign_in_as(user) }

  describe '#create' do
    let(:list) { List.find_by(id: body[:list][:id]) }

    it 'creates a new list' do
      post :create, params: { list: { name: 'New customers' } }
      expect(list.user).to eq(user)
      expect(list.name).to eq('New customers')
    end
  end

  describe '#update' do
    let(:list) { create(:list, user: user) }

    it 'allows updating the list' do
      patch :update, params: { id: list.id, list: { name: 'New name', sort_by: :created_at } }
      list.reload
      expect(list.name).to eq('New name')
      expect(body[:list]).to eq({ id: list.id, name: 'New name', sort_by: 'created_at' }.with_indifferent_access)
    end

    it 'only allows updating your own lists' do
      list.update_attribute(:user_id, create(:user).id)
      patch :update, params: { id: list.id, list: { name: 'New name' } }
      expect(body.key?(:errors)).to be_truthy
    end

    it 'returns an error if params are invalid' do
      patch :update, params: { id: list.id, list: { name: '' } }
      expect(body.key?(:errors)).to be_truthy
    end
  end

  describe '#index' do
    it 'lists users lists' do
      lists = build_list(:list, 3)
      allow(subject).to receive(:current_user) { user }
      allow(user).to receive(:lists) { lists }
      get :index
      expect(body[:lists].length).to eq(3)
    end
  end
end
