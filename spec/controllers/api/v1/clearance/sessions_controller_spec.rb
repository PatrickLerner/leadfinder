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

    it 'fails if data does not exist' do
      post :create, params: { session: { email: user.email, password: 'wrong' } }
      expect(body.key?(:user)).to be_falsey
      expect(body.key?(:errors)).to be_truthy
    end
  end

  describe '#destroy' do
    let(:user) { build_stubbed(:user) }
    before(:each) { sign_in_as(user) }

    it 'signs the user out' do
      expect(subject.send(:current_user)).to eq(user)
      expect(user).to receive(:save)
      delete :destroy
      expect(subject.send(:current_user)).to be_nil
    end
  end
end
