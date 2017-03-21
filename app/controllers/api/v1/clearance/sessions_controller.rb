class Api::V1::Clearance::SessionsController < ::Clearance::SessionsController
  def create
    @user = authenticate(params)

    sign_in(@user) do |status|
      if status.success?
        render json: { user: @user.to_api }
      else
        render json: { errors: status.failure_message }, status: :unauthorized
      end
    end
  end

  def destroy
    sign_out
    head :ok
  end

  rescue_from ActiveRecord::RecordNotFound do
    render json: { status: 404, errors: :not_found }, layout: false
  end
end
