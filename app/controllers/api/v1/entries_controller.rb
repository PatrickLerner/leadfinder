class Api::V1::EntriesController < Api::V1::BaseController
  def create
    @entry = current_user.entries.create(entry_params)
    if entry.save
      ListChannel.add_entry_to_list(entry, 'inbox')
      render json: entry
    else
      render json: { errors: entry.errors }
    end
  end

  def destroy
    removed_ids = entry.lists.pluck(:id).presence || %i(inbox)
    entry.destroy
    removed_ids.each { |id| ListChannel.remove_entry_from_list(entry, id) }
    head :ok
  end

  def lists
    @lists = current_user.lists.included_for_entry(entry)
    render json: ActiveModel::SerializableResource.new(
      @lists,
      each_serializer: EntryListSerializer
    ).as_json
  end

  def update_lists
    entry_list_removed_ids.each { |id| ListChannel.remove_entry_from_list(entry, id) }
    entry_list_added_ids.each { |id| ListChannel.add_entry_to_list(entry, id) }
    entry.update_attributes(list_ids: lists_from_params)

    head :ok
  end

  protected

  def entry_list_removed_ids
    (entry.list_ids - lists_from_params).presence || %i(inbox)
  end

  def entry_list_added_ids
    (lists_from_params - entry.list_ids).presence || %i(inbox)
  end

  def entry
    @entry ||= current_user.entries.find_by!(id: params[:id])
  end

  def lists_from_params
    return @lists_from_params if @lists_from_params.present?
    params[:entry] ||= {}
    params[:entry][:lists] ||= []
    @lists_from_params ||= params[:entry][:lists]
  end

  def entry_params
    params.require(:entry).permit(:first_name, :last_name, :position, :company_name, :email)
  end
end
