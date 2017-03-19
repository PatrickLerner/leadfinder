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
    @user = find_user_for_update

    if @user.update_password password_reset_params
      sign_in @user
      session[:password_reset_token] = nil
      render json: { status: :ok }
    else
      render json: { status: :failure, errors: :invalid_token }
    end
  end

  def find_user_by_id_and_confirmation_token
    User.find_by(confirmation_token: params[:token])
  end

  def ensure_existing_user
    render json: { errors: :invalid_token } unless find_user_by_id_and_confirmation_token
  end

  protected

  def find_user_for_create
    return unless params.key?(:password) && params[:password].key?(:email)
    User.find_by_normalized_email params[:password][:email]
  end
end
