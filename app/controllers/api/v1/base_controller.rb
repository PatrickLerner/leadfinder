class Api::V1::BaseController < ApplicationController
  respond_to :json

  before_action :require_login

  rescue_from ActiveRecord::RecordNotFound do
    render json: { status: 404, errors: :not_found }, layout: false
  end
end
