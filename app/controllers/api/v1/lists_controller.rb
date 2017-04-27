class Api::V1::ListsController < Api::V1::BaseController
  def index
    @lists = current_user.lists
    render json: { lists: @lists.map(&:to_api) }
  end

  def export
    send_data list.to_csv, filename: list.filename(extension: 'csv')
  end

  def show
    render json: { list: list.to_api(include: %i(entries entries_meta), page: params[:page]) }
  end

  def reassign
    if reassignment_destination.present?
      reassignment_destination.entry_ids = (reassignment_destination.entry_ids + reassignment_entry_ids).uniq
    end
    reassignment_source.entry_ids = [] if reassignment_source.present?
    render json: { success: true }
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

  def reassignment_source
    @reassignment_source ||= List.find_by(id: params[:id])
  end

  def reassignment_destination
    @reassignment_destination ||= List.find_by(id: params[:listId])
  end

  def reassignment_entry_ids
    @reassignment_entry_ids ||=
      if reassignment_source.present?
        reassignment_source.entry_ids
      else
        current_user.entries.unassigned.pluck(:id)
      end
  end

  def list
    @list ||= if params[:id] == 'inbox'
                List.new(name: 'Inbox', user: current_user)
              else
                current_user.lists.find_by!(id: params[:id])
              end
  end

  def send_update
    ListsChannel.update_lists_for(current_user)
  end

  def list_params
    params.require(:list).permit(:name, :sort_bt)
  end
end
