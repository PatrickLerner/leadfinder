class EntrySerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :position
  attribute :company_name, key: :company
  attributes :email, :lookup_state

  has_many :lists
  belongs_to :user
end
