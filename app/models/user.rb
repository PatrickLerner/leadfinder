class User < ApplicationRecord
  include Clearance::User

  has_many :lists

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :gender, presence: true
  validates :email, presence: true

  before_create :generate_default_lists

  protected

  def generate_default_lists
    lists.build(name: 'Potential Customers')
  end
end
