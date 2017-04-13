module Serializable
  extend ActiveSupport::Concern

  def to_api(options = {})
    ActiveModelSerializers::SerializableResource.new(
      self,
      options.reverse_merge(include: [])
    ).as_json
  end
end
