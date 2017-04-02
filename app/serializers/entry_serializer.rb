class EntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :first_name, :middle_name, :last_name, :position
  attributes :company, :company_cities, :email, :email_confidence
  attributes :lookup_state, :urls, :domain

  has_many :lists
  belongs_to :user

  def company
    object.company_name
  end

  def company_cities
    if object.company.present?
      object.company.addresses.pluck(:city).sort
    else
      []
    end
  end
end
