class EntrySerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :position, :company, :email

  has_many :lists
  belongs_to :user
end
