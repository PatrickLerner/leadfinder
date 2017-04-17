class Entry < ApplicationRecord
  include Entry::LookupState
  include Entry::Lookup
  include Entry::Duplicate
  include Entry::Guess
  include Entry::Name
  include Entry::Urls
  include Serializable

  belongs_to :user
  belongs_to :company, optional: true
  has_many :list_entries, class_name: 'List::Entry', dependent: :destroy
  has_many :lists, through: :list_entries
  has_many :links, class_name: 'Entry::Link', dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :company_name, presence: true
  validates :user, presence: true

  scope :unassigned, lambda {
    joins('LEFT JOIN list_entries AS el ON el.entry_id = entries.id')
      .group('entries.id')
      .where('el.list_id IS NULL')
  }

  searchkick

  def search_data
    data = as_json(
      only: %i(
        first_name middle_name last_name
        position company_name email
        user_id lookup_state company_id
        created_at updated_at
      )
    )
    Hash[data.map { |k, v| [k, v.try(:downcase) || v] }]
  end
end
