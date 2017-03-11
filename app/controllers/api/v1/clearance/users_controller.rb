class Api::V1::Clearance::UsersController < ::Clearance::UsersController
  def create
    @user = user_from_params

    if @user.save
      sign_in @user
      render json: { user: @user }
    else
      render json: { errors: @user.errors }
    end
  end

  def index
    render json: { user: current_user }
  end
end
