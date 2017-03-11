class Api::V1::ListsController < Api::V1::BaseController
  def index
    @lists = current_user.lists.order(:name)
    render json: @lists
  end

  def show
    @list = current_user.lists.find_by!(id: params[:id])
    render json: @list
  end
end
