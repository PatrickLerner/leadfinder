class ListSerializer < ActiveModel::Serializer
  attributes :id, :name, :sort_by

  has_many :entries
  belongs_to :user

  def entries
    object.entries.to_a.sort_by(&:created_at).reverse
  end
end
