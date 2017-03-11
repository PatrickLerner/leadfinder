class Api::V1::ListsController < Api::V1::BaseController
  def index
    @lists = current_user.lists.order(:name)
    render json: @lists
  end

  def show
    @list = current_user.lists.find_by!(id: params[:id])
    render json: @list
  end

  def create
    @list = current_user.lists.create(list_params)
    if @list.save
      render json: @list
    else
      render json: { errors: @list.errors }
    end
  end

  def destroy
    @list = current_user.lists.find_by!(id: params[:id])
    @list.destroy
    head :ok
  end

  protected

  def list_params
    params.require(:list).permit(:name, :sort_bt)
  end
end
