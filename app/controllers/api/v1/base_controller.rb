class Api::V1::BaseController < ApplicationController
  include Clearance::Authentication

  respond_to :json

  around_action :via_api_key, if: :api_key?
  before_action :require_login

  def require_login
    unless signed_in?
      head :unauthorized
      false
    end
    true
  end

  def via_api_key
    clearance_session.instance_variable_set(:@current_user, user_by_api_key)
    res = clearance_session.send(:run_sign_in_stack).success?
    yield if res
    clearance_session.instance_variable_set(:@current_user, nil)
  end

  protected

  def api_key?
    request.headers['X-API-KEY'].present? && user_by_api_key.present?
  end

  def user_by_api_key
    @user_by_api_key = User.where(api_key: request.headers['X-API-KEY']).where.not(api_key: nil).first
  end

  rescue_from ActiveRecord::RecordNotFound do
    render json: { status: 404, errors: :not_found }, layout: false
  end
end
