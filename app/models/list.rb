class List < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :sort_by, presence: true

  before_validation :generate_defaults

  protected

  def generate_defaults
    self.sort_by ||= :created_at
  end
end
