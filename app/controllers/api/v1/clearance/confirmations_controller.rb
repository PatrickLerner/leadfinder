class Api::V1::Clearance::ConfirmationsController < Api::V1::BaseController
  skip_before_action :require_login

  def create
    user = User.find_by(email: params[:email])
    if user.present?
      user.update_attribute(:email_confirmation_token, Clearance::Token.new)
      UserMailer.registration_confirmation(user).deliver_later
    end
    render json: { success: true }
  end

  def update
    user = User.find_by!(email_confirmation_token: params[:token])
    user.confirm_email!
    sign_in user
    render json: { success: true }
  end
end
