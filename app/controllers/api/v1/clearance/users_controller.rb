class Api::V1::Clearance::UsersController < ::Clearance::UsersController
  def create
    @user = User.create(user_params)
    if @user.errors.empty?
      sign_in @user
      render json: { user: @user.to_api }
    else
      render json: { errors: @user.errors }
    end
  end

  def update
    if current_user.update_attributes(user_params)
      render json: { user: current_user.to_api }
    else
      render json: { errors: current_user.errors }
    end
  end

  def index
    render json: { user: current_user.try(:to_api) }
  end

  protected

  def user_params
    params.require(:user).permit(%i(gender first_name last_name email password language))
  end
end
