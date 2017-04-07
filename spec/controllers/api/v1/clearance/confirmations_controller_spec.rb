require 'rails_helper'

describe Api::V1::Clearance::ConfirmationsController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  describe '#update' do
    context 'with email' do
      context 'with invalid email' do
        it 'just confirms' do
          post :create, params: { email: 'inexistent@me.com' }
          expect(body[:errors]).to_not be_present
        end
      end

      context 'with valid confirmation token' do
        let(:user) { create(:user, email_confirmation_token: :old_token) }

        it 'sends an email' do
          perform_enqueued_jobs do
            post :create, params: { email: user.email }
          end
          user.reload
          expect(user.email_confirmation_token).to be_present
          expect(user.email_confirmation_token).to_not eq('old_token')
          should_deliver_email(to: user.email, subject: 'Welcome to Lead Finder!')
        end
      end
    end

    context 'with token' do
      context 'with invalid confirmation token' do
        it 'raises RecordNotFound exception' do
          patch :update, params: { token: 'inexistent' }
          expect(body[:errors]).to be_present
        end
      end

      context 'with valid confirmation token' do
        let(:user) { create(:user, email_confirmation_token: 'valid_token', email_confirmed_at: nil) }

        it 'confirms user and signs them in' do
          patch :update, params: { token: user.email_confirmation_token }
          user.reload
          expect(user.email_confirmed_at).to be_present
          expect(controller.send(:current_user)).to eq(user)
        end
      end
    end
  end
end
