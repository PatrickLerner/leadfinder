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

    it 'fails to create if params are missing' do
      post :create, params: { list: { name: '' } }
      expect(body.key?(:errors)).to be_truthy
      expect(List.where(name: '')).to be_empty
    end
  end

  describe '#update' do
    let(:list) { create(:list, user: user) }

    it 'allows updating the list' do
      patch :update, params: { id: list.id, list: { name: 'New name', sort_by: :created_at } }
      list.reload
      expect(list.name).to eq('New name')
      expect(body[:list].slice(:id, :name, :sort_by)).to eq(
        { id: list.id, name: 'New name', sort_by: 'created_at' }.with_indifferent_access
      )
      expect(body[:list].keys.sort).to eq(%w(id name sort_by entry_count created_at).sort)
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

  describe '#export' do
    it 'sends the data' do
      get :export, params: { id: 'inbox' }
      expect(response.headers['Content-Type']).to eq('text/csv')
    end
  end

  describe '#destroy' do
    let(:list) { build_stubbed(:list) }

    it 'allows destroying a list' do
      allow(subject).to receive(:list) { list }
      expect(list).to receive(:destroy)
      expect(ListsChannel).to receive(:update_lists_for) do |current_user|
        expect(current_user.id).to eq(user.id)
      end

      delete :destroy, params: { id: list.id }
    end

    it 'does not fail to destroy the inbox' do
      delete :destroy, params: { id: 'inbox' }
      expect(response).to be_success
    end
  end

  describe '#show' do
    it 'allows showing a list' do
      get :show, params: { id: 'inbox' }
      expect(response).to be_success
      expect(body[:list].keys.sort).to eq(%w(entries entries_meta id name sort_by created_at entry_count).sort)
    end
  end

  describe '#reassign' do
    let(:entry_count) { 3 }
    let(:list) { create(:list, with_entries: entry_count) }
    let(:new_list) { create(:list) }

    before(:each) do
      allow(List).to receive(:find_by!) do |options|
        if options[:id] == list.id
          list
        elsif options[:id] == new_list.id
          new_list
        end
      end
    end

    it 'reassigns all entries of the list' do
      expect(list.entries.length).to eq(entry_count)
      post :reassign, params: { id: list.id, listId: new_list.id }
      expect(list.entries.length).to eq(0)
      expect(new_list.entries.length).to eq(entry_count)
    end

    it 'reassigns all inbox entries' do
      create(:entry, user: user)
      expect(user.entries.unassigned.length).to eq(1)
      post :reassign, params: { id: 'inbox', listId: new_list.id }
      expect(user.entries.unassigned.length).to eq(0)
      expect(new_list.entries.length).to eq(1)
    end
  end
end
