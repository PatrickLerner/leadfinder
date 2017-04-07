class User < ApplicationRecord
  include Serializable
  include Clearance::User

  has_many :lists, -> { order(:name) }
  has_many :entries

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :gender, presence: true
  validates :email, presence: true

  before_create :generate_default_lists

  def confirm_email!
    return unless email_confirmed_at.nil?
    self.email_confirmed_at = DateTime.now
    save!
  end

  protected

  def generate_default_lists
    lists.build(name: 'Potential Customers')
  end
end
