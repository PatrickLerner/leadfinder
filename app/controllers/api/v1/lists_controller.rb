class Api::V1::ListsController < Api::V1::BaseController
  def index
    @lists = current_user.lists
    render json: { lists: @lists.map(&:to_api) }
  end

  def inbox
    @list = List.new(name: 'Inbox', user: current_user)
    list.entries = current_user.entries.unassigned
    render json: { list: list.to_api(include: %i(entries)) }
  end

  def show
    render json: { list: list.to_api(include: %i(entries)) }
  end

  def create
    @list = current_user.lists.create(list_params)
    if list.save
      send_update
      render json: { list: list.to_api }
    else
      render json: { errors: list.errors }
    end
  end

  def update
    list.update_attributes(list_params)
    if list.save
      send_update
      render json: { list: list.to_api }
    else
      render json: { errors: list.errors }
    end
  end

  def destroy
    list.destroy
    send_update
    head :ok
  end

  protected

  def list
    @list ||= current_user.lists.find_by!(id: params[:id])
  end

  def send_update
    ListsChannel.update_lists_for(current_user)
  end

  def list_params
    params.require(:list).permit(:name, :sort_bt)
  end
end
