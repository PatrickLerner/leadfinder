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

  protected

  def user_from_params
    gender = user_params.delete(:gender)
    first_name = user_params.delete(:first_name)
    last_name = user_params.delete(:last_name)
    email = user_params.delete(:email)
    password = user_params.delete(:password)

    Clearance.configuration.user_model.new(user_params).tap do |user|
      user.gender = gender
      user.first_name = first_name
      user.last_name = last_name
      user.email = email
      user.password = password
    end
  end
end
