class Entry < ApplicationRecord
  include Entry::LookupState
  include Entry::Lookup
  include Entry::Guess
  include Serializable

  belongs_to :user
  belongs_to :company, optional: true
  has_many :list_entries, class_name: 'List::Entry', dependent: :destroy
  has_many :lists, through: :list_entries

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :company_name, presence: true
  validates :user, presence: true

  scope :unassigned, lambda {
    joins('LEFT JOIN list_entries AS el ON el.entry_id = entries.id')
      .group('entries.id')
      .where('el.list_id IS NULL')
  }

  TITLES = %w(PROF PROFESSOR DR DOC DOCTOR MR MRS MISS FRAU HERR REVERREND REV).freeze

  def name=(name)
    parts = name.split(' ').reverse
    parts = extract_title(parts)
    self.first_name = parts.pop
    self.last_name = parts[0]
    self.middle_name = parts[1..-1].reverse.join(' ')
  end

  protected

  def extract_title(parts)
    titles = []
    loop do
      last_part = parts.last.upcase.gsub(/\.$/, '')
      break unless last_part.in?(TITLES)
      titles << parts.last
      parts.pop
    end
    self.title = titles.join(' ')
    parts
  end
end
