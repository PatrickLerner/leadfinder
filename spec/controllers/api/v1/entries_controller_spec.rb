require 'rails_helper'

describe Api::V1::EntriesController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  before(:each) { sign_in }

  describe '#create' do
    let(:entry) { Entry.find_by(id: body[:entry][:id]) }
    let(:list) { create(:list) }

    it 'creates a new entry' do
      post :create, params: { entry: { first_name: 'Peter', last_name: 'Müller', company_name: 'Test GmbH' } }
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Müller')
      expect(entry.lists).to be_empty
    end

    it 'returns failure if a param is missing' do
      post :create, params: { entry: { last_name: 'Müller', company_name: 'Test GmbH' } }
      expect(body.key?(:errors)).to be_truthy
      expect(body[:errors].key?(:first_name)).to be_truthy
    end

    it 'it automatically adds the item to the correct list' do
      post :create, params: { entry: {
        first_name: 'Peter',
        last_name: 'Müller',
        company_name: 'Test GmbH',
        lists: [list.id]
      } }
      expect(entry.lists.pluck(:id).first).to eq(list.id)
    end
  end

  describe '#destroy' do
    let(:lists) { build_stubbed_list(:list, 2, user: entry.user) }
    let(:entry) { build_stubbed(:entry) }

    before(:each) do
      allow(subject).to receive(:entry) { entry }
      expect(entry).to receive(:destroy)
    end

    it 'notifies lists' do
      allow(entry).to receive(:lists) { lists }
      expect(ListChannel).to receive(:remove_entry_from_list).twice { |entry, id|
        expect(entry).to eq(entry)
        expect(lists.map(&:id)).to include(id)
      }
      delete :destroy, params: { id: entry.id }
    end

    it 'notifies inbox if no lists' do
      entry.lists = []
      expect(ListChannel).to receive(:remove_entry_from_list) { |entry, id|
        expect(entry).to eq(entry)
        expect(id).to eq(:inbox)
      }
      delete :destroy, params: { id: entry.id }
    end
  end

  describe '#update_lists' do
    let(:list) { create(:list) }
    let(:old_list) { create(:list) }
    let(:entry) { build_stubbed(:entry) }

    before(:each) do
      allow(entry).to receive(:list_ids) { [old_list.id] }
    end

    it 'allows assigning an entry to a list' do
      allow(subject).to receive(:entry) { entry }
      expect(entry).to receive(:update_attributes) { |options|
        expect(options).to eq(list_ids: [list.id])
      }
      patch :update_lists, params: { id: entry.id, entry: { lists: [list.id] } }
    end

    it 'sends update to lists' do
      allow(subject).to receive(:entry) { entry }
      expect(entry).to receive(:update_attributes)
      expect(ListChannel).to receive(:remove_entry_from_list) { |_, id|
        expect(id).to eq(old_list.id)
      }
      expect(ListChannel).to receive(:add_entry_to_list) { |_, id|
        expect(id).to eq(list.id)
      }
      patch :update_lists, params: { id: entry.id, entry: { lists: [list.id] } }
    end
  end
end
