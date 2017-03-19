require 'rails_helper'

describe Api::V1::Clearance::SessionsController, type: :controller do
  let(:body) { JSON.parse(response.body).with_indifferent_access }

  describe '#create' do
    let(:password) { 'test1234' }
    let!(:user) { create(:user, password: password) }

    it 'returns the current user' do
      post :create, params: { session: { email: user.email, password: password } }
      expect(body.key?(:user)).to be_truthy
      expect(body[:user][:first_name]).to eq(user.first_name)
    end
  end
end
