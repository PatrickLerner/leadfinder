class List < ApplicationRecord
  include Serializable

  belongs_to :user
  has_and_belongs_to_many :entries

  validates :name, presence: true, length: { minimum: 1 }
  validates :sort_by, presence: true
  validates :user, presence: true

  before_validation :generate_defaults

  scope :included_for_entry, lambda { |entry|
    joins('LEFT JOIN entries_lists AS el ON el.list_id = lists.id AND ' \
          "el.entry_id = '#{entry.try(:id) || entry}'")
      .group('lists.id, el.entry_id')
      .select('lists.*, (el.entry_id IS NOT NULL) AS included')
  }

  protected

  def generate_defaults
    self.sort_by ||= :created_at
  end
end
