require 'rails_helper'

describe List, type: :model do
  it_behaves_like 'a model with factory'

  it { expect(subject).to validate_presence_of(:name) }

  describe '#destroy' do
    let!(:entry_count) { 1 }
    let!(:list_with_entries) { create(:list, with_entries: entry_count) }
    let!(:entries) { list_with_entries.entries }

    it 'unassigns entries when deleting last list' do
      expect(entries.count).to eq(entry_count)
      expect(entries.first.lists.count).to eq(1)
      list_with_entries.destroy!
      expect(entries.first.lists).to be_empty
    end
  end
end
