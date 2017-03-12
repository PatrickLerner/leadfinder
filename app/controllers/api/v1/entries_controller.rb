class Api::V1::EntriesController < Api::V1::BaseController
  def create
    @entry = current_user.entries.create(list_params)
    if @entry.save
      render json: @entry
    else
      render json: { errors: @entry.errors }
    end
  end

  def destroy
    @entry = current_user.entries.find_by!(id: params[:id])
    @entry.destroy
    send_update
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

  protected

  def list_params
    params.require(:entry).permit(:first_name, :last_name, :position, :company, :email)
  end
end
