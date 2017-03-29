class Company::Hunterio < ApplicationRecord
  validates :domain, presence: true, uniqueness: true
  validates :response, presence: true

  def self.find_domain(domain)
    find_or_initialize_by(domain: domain)
  end

  def response
    return nil if read_attribute(:response).nil?
    JSON.parse(read_attribute(:response))
  end

  def response=(val)
    write_attribute(:response, val.to_json)
  end
end
