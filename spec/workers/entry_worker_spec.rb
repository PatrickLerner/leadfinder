require 'rails_helper'

describe EntryWorker, type: :worker do
  it 'performs' do
    entry = double
    expect(entry).to receive(:test)
    allow(Entry).to receive(:find_by) do |options|
      expect(options[:id]).to eq(123)
      entry
    end
    EntryWorker.new.perform(123, :test)
  end
end
