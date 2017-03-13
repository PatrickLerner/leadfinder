class ListChannel < ActionCable::Channel::Base
  def subscribed
    stream_from ListChannel.user_channel_name(current_user, params[:listId])
  end

  def self.remove_entry_from_list(entry, listId)
    ActionCable.server.broadcast(
      user_channel_name(entry.user, listId),
      remove: {
        id: entry.id
      }
    )
  end

  def self.add_entry_to_list(entry, listId)
    ActionCable.server.broadcast(
      user_channel_name(entry.user, listId),
      add: ActiveModelSerializers::SerializableResource.new(entry, include: []).as_json
    )
  end

  protected

  def current_user
    env[:clearance].current_user
  end

  def self.user_channel_name(user, listId)
    "lists:#{user.id}:#{listId}"
  end
end
