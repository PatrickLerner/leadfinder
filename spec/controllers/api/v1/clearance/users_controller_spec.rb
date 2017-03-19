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
end
