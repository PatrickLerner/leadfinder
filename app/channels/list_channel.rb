class ListChannel < ActionCable::Channel::Base
  def subscribed
    stream_from ListChannel.user_channel_name(current_user, params[:listId])
  end

  def self.remove_entry_from_list(entry, list_id)
    ActionCable.server.broadcast(
      user_channel_name(entry.user, list_id),
      remove: {
        id: entry.id
      }
    )
  end

  def self.add_entry_to_list(entry, list_id)
    ActionCable.server.broadcast(
      user_channel_name(entry.user, list_id),
      add: ActiveModelSerializers::SerializableResource.new(entry, include: []).as_json
    )
  end

  def self.update_entry_in_list(entry, list_id)
    ActionCable.server.broadcast(
      user_channel_name(entry.user, list_id),
      update: ActiveModelSerializers::SerializableResource.new(entry, include: []).as_json
    )
  end

  def self.user_channel_name(user, list_id)
    "lists:#{user.id}:#{list_id}"
  end

  protected

  def current_user
    env[:clearance].current_user
  end
end
