require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe 'change_password' do
    let(:user) { build_stubbed(:user, confirmation_token: 'testtoken') }
    let(:mail) { described_class.change_password(user) }

    it 'renders the headers' do
      expect(mail.to).to eq([user.email])
    end

    it 'renders the body' do
      expect(mail.body.encoded).to_not be_blank
    end
  end
end
