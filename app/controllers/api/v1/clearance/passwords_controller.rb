class Api::V1::Clearance::PasswordsController < ::Clearance::PasswordsController
  def create
    user = find_user_for_create
    if user.present?
      user.forgot_password!
      UserMailer.change_password(user).deliver_later
    end
    head :ok
  end

  def update
    if user_for_update.update_password(password_reset_params)
      user_for_update.confirm_email!
      sign_in user_for_update
      session[:password_reset_token] = nil
      render json: { success: true }
    else
      render json: { success: false, errors: :invalid_token }
    end
  end

  protected

  def user_for_update
    @user_for_update ||= User.find_by(confirmation_token: params[:token])
  end

  def ensure_existing_user
    render json: { success: false, errors: :invalid_token } unless find_user_for_update
  end

  def find_user_for_create
    return unless password_email_param?
    User.find_by_normalized_email params[:password][:email]
  end

  def password_email_param?
    params.key?(:password) && params[:password].key?(:email)
  end
end
