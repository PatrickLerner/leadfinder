class Company < ApplicationRecord
  has_many :entries
  has_many :addresses, class_name: 'Company::Address'

  validates :name, presence: true
  validates :domain, presence: true

  def self.find_by_name(name)
    Company.where('lower(name) = ?', name).first
  end

  def self.allows_determination?
    true
  end
end
