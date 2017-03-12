class Entry < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :lists

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :company, presence: true
  validates :user, presence: true

  scope :unassigned, -> {
    joins('LEFT JOIN entries_lists AS el ON el.entry_id = entries.id')
      .group('entries.id')
      .where('el.list_id IS NULL')
  }
end
