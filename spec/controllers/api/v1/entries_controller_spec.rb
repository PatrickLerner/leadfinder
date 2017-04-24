require 'rails_helper'

describe Api::V1::EntriesController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }
  let(:user) { create(:user) }

  before(:each) { sign_in_as(user) }

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

    it 'allows to only specify a name' do
      post :create, params: { entry: { name: 'Peter Müller', company_name: 'Test GmbH' } }
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Müller')
      expect(entry.lists).to be_empty
    end

    it 'throws an error if only specifies insufficient name' do
      post :create, params: { entry: { name: 'Peter', company_name: 'Test GmbH' } }
      expect(body.key?(:errors)).to be_truthy
      expect(body[:errors].key?(:last_name)).to be_truthy
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

    it 'allows to specify urls in request' do
      post :create, params: { entry: {
        first_name: 'Peter',
        last_name: 'Müller',
        company_name: 'Test GmbH',
        urls: ['http://example.com/']
      } }
      expect(entry.urls.first).to eq('http://example.com/')
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

  describe '#lists' do
    let!(:list_count) { 3 }
    let!(:entry) { create(:entry, with_lists: list_count, user: user) }

    it 'returns a list of the lists of the user' do
      get :lists, params: { id: entry.id }
      expect(body[:lists].count).to eq(user.lists.count)
      included_lists = body[:lists].select { |list| list[:included] }
      expect(included_lists.count).to eq(list_count)
    end
  end

  describe '#show' do
    let(:entry) { build_stubbed(:entry, user: user) }

    it 'returns an entry' do
      allow(subject).to receive(:entry) { entry }
      get :show, params: { id: entry.id }
      expect(body.key?(:entry)).to be_truthy
      expect(body.key?(:errors)).to be_falsey
    end

    it 'throws an error if not found' do
      get :show, params: { id: 'i dont exist' }
      expect(body.key?(:entry)).to be_falsey
      expect(body.key?(:errors)).to be_truthy
    end
  end

  describe '#update' do
    let(:entry) { build_stubbed(:entry, user: user) }

    before(:each) do
      allow(subject).to receive(:entry) { entry }
    end

    it 'updates the values' do
      expect(entry).to receive(:update_attributes) { |param| entry.assign_attributes(param) }
      expect(entry.first_name).to_not eq('Peterchen')
      patch :update, params: { id: entry.id, entry: { first_name: 'Peterchen' } }
      expect(entry.first_name).to eq('Peterchen')
    end

    describe 'lists' do
      let(:list) { create(:list) }
      let(:old_list) { create(:list) }

      before(:each) do
        allow(entry).to receive(:list_ids) { [old_list.id] }
      end

      it 'allows assigning an entry to a list' do
        allow(subject).to receive(:entry) { entry }
        expect(entry).to receive(:update_attributes) { |options|
          expect(options.keys).to eq(%w(list_ids))
          expect(options.values).to eq([[list.id]])
        }
        patch :update, params: { id: entry.id, entry: { lists: [list.id] } }
      end

      it 'sends update to lists' do
        allow(subject).to receive(:entry) { entry }
        expect(entry).to receive(:update_attributes) { true }
        expect(ListChannel).to receive(:remove_entry_from_list) { |_, id|
          expect(id).to eq(old_list.id)
        }
        expect(ListChannel).to receive(:add_entry_to_list) { |_, id|
          expect(id).to eq(list.id)
        }
        patch :update, params: { id: entry.id, entry: { lists: [list.id] } }
      end
    end
  end

  describe '#retrieve' do
    let(:entry) { Entry.find_by(id: body[:entry][:id]) }
    let(:mock_entry) { build(:entry, user_id: user.id, name: 'Peter Müller') }

    before(:each) do
      allow(Company::GooglePlacesLookup).to receive(:lookup) { create(:company) }
    end

    describe 'sufficient information' do
      before(:each) do
        allow(Entry).to receive(:find_or_initialize_by) { mock_entry }
      end

      it 'creates a new entry' do
        allow(mock_entry).to receive(:determine_email)
        allow(mock_entry).to receive(:guess_email)
        post :retrieve, params: { entry: { name: 'Peter Müller', company_name: 'Test GmbH' } }
        expect(entry.first_name).to eq('Peter')
        expect(entry.last_name).to eq('Müller')
        expect(entry.lists).to be_empty
      end

      it 'retrieves information inline' do
        allow(mock_entry).to receive(:guess_email)
        expect(EntryWorker).to_not receive(:perform_async)
        expect(mock_entry).to receive(:determine_email)
        post :retrieve, params: { entry: { name: 'Peter Müller', company_name: 'Test GmbH' } }
        expect(entry).to be_present
      end

      it 'guesses if it fails' do
        allow(mock_entry).to receive(:guess_email_hunterio) { '%{fn}' }
        mock_entry.email_format = '%{fn}'
        mock_entry.email_confidence = 100
        expect(EntryWorker).to_not receive(:perform_async)

        expect(mock_entry).to receive(:test_all_variants) { raise EmailVerifier::FailureException }
        post :retrieve, params: { entry: { name: 'Peter Müller', company_name: 'Test GmbH' } }
        expect(entry.email).to be_present
        expect(entry.email).to eq("#{entry.first_name}@#{entry.domain}".downcase)
      end

      it 'returns the duplicate if it exists' do
        duplicate = build_stubbed(:entry)
        allow(mock_entry).to receive(:duplicate) { duplicate }
        post :retrieve, params: { entry: { name: 'Peter Müller', company_name: 'Test GmbH' } }
        expect(body[:entry][:first_name]).to eq(duplicate.first_name)
        expect(body[:entry][:last_name]).to eq(duplicate.last_name)
      end
    end

    describe 'insufficient information' do
      it 'fails if information is insufficient' do
        post :retrieve, params: { entry: { company_name: 'Test GmbH' } }
        expect(body[:errors]).to be_present
        expect(body[:entry]).to be_nil
      end
    end
  end

  describe '#latest' do
    before(:each) do
      fake_entries = double
      allow(fake_entries).to receive(:latest) { |count| build_stubbed_list(:entry, count) }
      allow(user).to receive(:entries) { fake_entries }
    end

    it 'returns the last two entries in api representation' do
      get :latest
      expect(body[:entries]).to be_present
      expect(body[:entries].count).to eq(2)
    end
  end
end
