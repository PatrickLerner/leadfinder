require 'rails_helper'

describe ListsChannel, type: :controller do
  let(:user) { create(:user) }

  before(:each) { sign_in_as(user) }
  before(:each) { allow_any_instance_of(described_class).to receive(:delegate_connection_identifiers) }

  let(:channel) { described_class.new(nil, nil) }

  before(:each) do
    channel.class.send(:attr_accessor, :env)
    allow(channel).to receive(:env) {
      clearance = double
      allow(clearance).to receive(:current_user) { user }
      { clearance: clearance }
    }
  end

  describe '#subscribe' do
    it 'allows to stream from the correct channel' do
      expect(channel).to receive(:stream_from) { |name|
        expect(name).to eq("lists:#{user.id}")
      }
      channel.subscribed
    end
  end
end
