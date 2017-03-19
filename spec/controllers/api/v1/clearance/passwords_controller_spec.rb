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
end
