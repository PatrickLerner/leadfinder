class EntrySerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :position
  attributes :company, :company_cities, :email, :lookup_state

  has_many :lists
  belongs_to :user

  def company
    if object.company.present?
      object.company.name
    else
      object.company_name
    end
  end

  def company_cities
    if object.company.present?
      object.company.addresses.pluck(:city).sort
    else
      []
    end
  end
end
