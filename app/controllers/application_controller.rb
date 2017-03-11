class ApplicationController < ActionController::Base
  include Clearance::Controller
  protect_from_forgery with: :exception

  after_action :set_csrf_cookie_for_ng, if: :protect_against_forgery?

  protected

  def verified_request?
    return true
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end

  def set_csrf_cookie_for_ng
    cookies['CSRF-TOKEN'] = form_authenticity_token
  end
end
