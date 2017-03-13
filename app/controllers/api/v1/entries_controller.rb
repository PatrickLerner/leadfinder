class Api::V1::EntriesController < Api::V1::BaseController
  def create
    @entry = current_user.entries.create(list_params)
    if @entry.save
      ListChannel.add_entry_to_list(@entry, 'inbox')
      render json: @entry
    else
      render json: { errors: @entry.errors }
    end
  end

  def destroy
    @entry = current_user.entries.find_by!(id: params[:id])
    removed_ids = @entry.lists.pluck(:id)
    removed_ids = %i(inbox) if removed_ids.empty?
    @entry.destroy
    removed_ids.each { |id| ListChannel.remove_entry_from_list(@entry, id) }
    head :ok
  end

  def lists
    @entry = current_user.entries.find_by!(id: params[:id])
    @lists = current_user.lists.included_for_entry(@entry)
    render json: ActiveModel::SerializableResource.new(
      @lists,
      each_serializer: EntryListSerializer
    ).as_json
  end

  def update_lists
    @entry = current_user.entries.find_by!(id: params[:id])
    list_ids = []
    if params.key?(:entry) && params[:entry].key?(:lists)
      list_ids = params[:entry][:lists]
    end
    removed_ids = @entry.list_ids - list_ids
    removed_ids = %i(inbox) if removed_ids.empty?
    added_ids = list_ids - @entry.list_ids
    added_ids = %i(inbox) if added_ids.empty?
    @entry.update_attributes(list_ids: list_ids)

    removed_ids.each { |id| ListChannel.remove_entry_from_list(@entry, id) }
    added_ids.each { |id| ListChannel.add_entry_to_list(@entry, id) }

    head :ok
  end

  protected

  def list_params
    params.require(:entry).permit(:first_name, :last_name, :position, :company, :email)
  end
end
