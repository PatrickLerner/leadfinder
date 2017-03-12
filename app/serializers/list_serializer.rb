class ListSerializer < ActiveModel::Serializer
  attributes :id, :name, :sort_by

  has_many :entries
  belongs_to :user
end
