require 'rails_helper'

describe Api::V1::Clearance::PasswordsController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  describe '#create' do
    let!(:user) { create(:user, confirmation_token: 'token') }

    it 'sends an email' do
      allow(User).to receive(:find_by_normalized_email) { user }
      expect(user).to receive(:forgot_password!)

      perform_enqueued_jobs do
        post :create, params: { password: { email: user.email } }
      end
      expect(response).to be_successful
      should_deliver_email(to: user.email, subject: 'Password Reset')
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

    it 'confirms user if reset worked' do
      user.email_confirmed_at = nil
      allow(User).to receive(:find_by) { user }
      allow(user).to receive(:update_password) { true }
      allow(user).to receive(:confirm_email!)
      patch :update, params: { password_reset: { token: :test } }
    end
  end
end
