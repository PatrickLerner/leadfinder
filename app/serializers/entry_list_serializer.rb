class EntryListSerializer < ActiveModel::Serializer
  attributes :id, :name

  attributes :included

  def included
    object.included
  end
end
