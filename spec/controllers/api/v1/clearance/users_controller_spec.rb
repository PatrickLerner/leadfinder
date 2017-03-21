require 'rails_helper'

describe Api::V1::Clearance::UsersController, type: :controller do
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
    let(:user_params) do
      {
        gender: :male,
        first_name: 'Bob',
        last_name: 'Bobson',
        email: 'bobby@bobington.bob',
        password: 'bob12345'
      }
    end

    let(:user) { User.find_by(email: 'bobby@bobington.bob') }

    it 'can creae a new user' do
      post :create, params: { user: user_params }
      expect(user).to be_present
    end

    it 'fails if params are missing' do
      post :create, params: { user: user_params.slice(:email, :password) }
      expect(user).to_not be_present
    end
  end
end
