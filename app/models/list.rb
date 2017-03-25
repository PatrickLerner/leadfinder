class List < ApplicationRecord
  include Serializable

  belongs_to :user
  has_many :list_entries, class_name: 'List::Entry', dependent: :destroy
  has_many :entries, through: :list_entries

  validates :name, presence: true, length: { minimum: 1 }
  validates :sort_by, presence: true
  validates :user, presence: true

  before_validation :generate_defaults

  scope :included_for_entry, lambda { |entry|
    joins('LEFT JOIN list_entries AS el ON el.list_id = lists.id AND ' \
          "el.entry_id = '#{entry.try(:id) || entry}'")
      .group('lists.id, el.entry_id')
      .select('lists.*, (el.entry_id IS NOT NULL) AS included')
  }

  def to_csv(options = {})
    columns = %i(first_name last_name position company_name email email_confidence)
    # required for excel to not be retarded about encoding
    magic_unicode_char = "\uFEFF".encode('utf-8')
    magic_unicode_char + CSV.generate(options) do |csv|
      csv << columns

      entries.each do |entry|
        csv << columns.map do |column|
          entry.send(column)
        end
      end
    end
  end

  def filename(extension: nil)
    filename = "#{name.tr(' ', '_').downcase}-#{Date.today.strftime('%Y-%m-%d')}"
    filename += ".#{extension}" if extension.present?
    filename
  end

  protected

  def generate_defaults
    self.sort_by ||= :created_at
  end
end
