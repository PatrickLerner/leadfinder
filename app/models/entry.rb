class Entry < ApplicationRecord
  include Entry::LookupState
  include Entry::Lookup

  belongs_to :user
  belongs_to :company, optional: true
  has_and_belongs_to_many :lists

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :company_name, presence: true
  validates :user, presence: true

  scope :unassigned, lambda {
    joins('LEFT JOIN entries_lists AS el ON el.entry_id = entries.id')
      .group('entries.id')
      .where('el.list_id IS NULL')
  }
end
