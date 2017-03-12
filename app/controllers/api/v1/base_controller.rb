class Api::V1::BaseController < ApplicationController
  respond_to :json

  before_action :require_login
end
