class ListsChannel < ActionCable::Channel::Base
  def subscribed
    stream_from ListsChannel.user_channel_name(current_user)
  end

  def self.update_lists_for(user)
    ActionCable.server.broadcast(
      user_channel_name(user),
      ActiveModelSerializers::SerializableResource.new(user.lists).as_json
    )
  end

  protected

  def current_user
    env[:clearance].current_user
  end

  def self.user_channel_name(user)
    "lists:#{user.id}"
  end
end
