class Api::V1::Clearance::SessionsController < ::Clearance::SessionsController
  def create
    @user = authenticate(params)

    sign_in(@user) do |status|
      if status.success?
        render json: { user: @user }
      else
        render json: { error: status.failure_message }, status: :unauthorized
      end
    end
  end

  def destroy
    sign_out
    head :ok
  end
end
