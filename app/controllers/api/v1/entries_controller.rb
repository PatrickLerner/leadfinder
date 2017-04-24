class Api::V1::EntriesController < Api::V1::BaseController
  def create
    if build_new_entry.save
      (lists_from_params.presence || %i(inbox)).each { |id| ListChannel.add_entry_to_list(entry, id) }
      render json: { entry: entry.to_api }
    else
      render json: { errors: entry.errors }
    end
  end

  def retrieve
    if retrieve_entry
      render json: { entry: entry.to_api }
    else
      render json: { errors: entry.errors }
    end
  end

  def show
    render json: { entry: entry.to_api }
  end

  def destroy
    removed_ids = entry.lists.pluck(:id).presence || %i(inbox)
    entry.destroy
    removed_ids.each { |id| ListChannel.remove_entry_from_list(entry, id) }
    head :ok
  end

  def lists
    @lists = current_user.lists.included_for_entry(entry)
    render json: {
      lists: ActiveModelSerializers::SerializableResource.new(@lists, each_serializer: EntryListSerializer).as_json
    }
  end

  def latest
    entries = current_user.entries.latest(params[:count].presence || 2).map(&:to_api)
    render json: { entries: entries }
  end

  before_action :entry_list_removed_ids, only: :update
  before_action :entry_list_added_ids, only: :update

  def update
    if entry.update_attributes(entry_params)
      update_update_lists
      render json: { entry: entry.to_api }
    else
      render json: { errors: entry.errors }
    end
  end

  protected

  def update_update_lists
    return unless params[:entry][:lists].present?
    entry_list_removed_ids.each { |id| ListChannel.remove_entry_from_list(entry, id) }
    entry_list_added_ids.each { |id| ListChannel.add_entry_to_list(entry, id) }
  end

  def build_new_entry
    @entry = current_user.entries.new(entry_params)
  end

  def entry_list_removed_ids
    @entry_list_removed_ids ||= (entry.list_ids - lists_from_params).presence || %i(inbox)
  end

  def entry_list_added_ids
    @entry_list_added_ids ||= (lists_from_params - entry.list_ids).presence || %i(inbox)
  end

  def entry
    @entry ||= current_user.entries.find_by!(id: params[:id])
  end

  def retrieve_entry
    @entry ||= Entry.lookup_inline!(entry_params.merge(user: current_user))
  end

  def lists_from_params
    return @lists_from_params if @lists_from_params.present?
    params[:entry] ||= {}
    params[:entry][:lists] ||= []
    @lists_from_params = params[:entry][:lists] - %w(inbox)
  end

  def entry_params
    return @entry_params if @entry_params.present?
    @entry_params = params.require(:entry).permit(
      :first_name, :middle_name, :last_name, :name, :title, :position, :company_name, :email, :domain,
      urls: []
    )
    @entry_params[:list_ids] = lists_from_params if params[:entry][:lists].present?
    @entry_params
  end
end
