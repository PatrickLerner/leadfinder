require 'rails_helper'

describe Api::V1::Clearance::PasswordsController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  describe '#create' do
    let!(:user) { create(:user) }

    it 'sends an email' do
      allow(User).to receive(:find_by_normalized_email) { user }
      expect(user).to receive(:forgot_password!)

      delivery = double
      expect(delivery).to receive(:deliver_later).with(no_args)
      expect(UserMailer).to receive(:change_password).and_return(delivery)

      post :create, params: { password: { email: user.email } }
      expect(response).to be_successful
    end
  end

  describe '#update' do
    let(:user) { build_stubbed(:user) }

    it 'shows an error if user does not exist' do
      allow(User).to receive(:find_by) { nil }
      patch :update, params: { password_reset: { token: :test } }
      expect(body[:success]).to be_falsey
    end

    it 'throws an error if token is invalid' do
      allow(User).to receive(:find_by) { user }
      allow(user).to receive(:update_password) { false }
      patch :update, params: { password_reset: { token: :test } }
      expect(body[:success]).to be_falsey
    end

    it 'allows to reset' do
      allow(User).to receive(:find_by) { user }
      allow(user).to receive(:update_password) { true }
      patch :update, params: { password_reset: { token: :test } }
      expect(body[:success]).to be_truthy
    end
  end
end
