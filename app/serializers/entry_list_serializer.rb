class EntryListSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name

  attributes :included

  def included
    object.included
  end
end
