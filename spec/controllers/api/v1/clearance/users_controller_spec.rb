require 'rails_helper'

describe Api::V1::Clearance::UsersController, type: :controller do
  let(:user_email) { 'bobby@bobington.bob' }
  let(:user_params) do
    {
      gender: :male,
      first_name: 'Bob',
      last_name: 'Bobson',
      email: user_email,
      password: 'bob12345'
    }
  end
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  describe '#index' do
    let(:user) { create(:user) }
    before(:each) { sign_in_as(user) }

    it 'returns the current user' do
      get :index
      expect(body.key?(:user)).to be_truthy
      expect(body[:user][:first_name]).to eq(user.first_name)
    end
  end

  describe '#create' do
    let(:user) { User.find_by(email: 'bobby@bobington.bob') }

    it 'can creae a new user' do
      post :create, params: { user: user_params }
      expect(user).to be_present
    end

    it 'sends an email' do
      perform_enqueued_jobs do
        post :create, params: { user: user_params }
      end
      expect(controller.send(:current_user)).to be_nil
      expect(user.email_confirmation_token).to be_present
      should_deliver_email(to: user_email, subject: 'Welcome to Whistle!')
    end

    it 'fails if params are missing' do
      post :create, params: { user: user_params.slice(:email, :password) }
      expect(user).to_not be_present
    end
  end

  describe '#update' do
    let(:user) { create(:user) }
    before(:each) { sign_in_as(user) }

    it 'allows updating the user' do
      post :update, params: { user: user_params.merge(first_name: 'Peter') }
      expect(body.key?(:user)).to be_truthy
      expect(user.reload.first_name).to eq('Peter')
    end

    it 'fails if parameters are not allowed' do
      post :update, params: { user: user_params.merge(first_name: '') }
      expect(body.key?(:errors)).to be_truthy
      expect(user.reload.first_name).to_not eq('')
    end
  end
end
