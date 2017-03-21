module Serializable
  extend ActiveSupport::Concern

  def to_api(options = {})
    ActiveModelSerializers::SerializableResource.new(
      self,
      include: options[:include] || []
    ).as_json
  end
end
