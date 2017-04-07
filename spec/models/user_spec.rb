require 'rails_helper'

describe User, type: :model do
  it_behaves_like 'a model with factory'

  describe '#confirm_email' do
    let(:user) { build_stubbed(:user, email_confirmation_token: 'token', email_confirmed_at: nil) }

    it 'sets email_confirmed_at value' do
      allow(user).to receive(:save!)
      user.confirm_email!
      expect(user.email_confirmed_at).to be_present
    end
  end
end
