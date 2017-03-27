class Entry::Link < ApplicationRecord
  belongs_to :entry

  validates :entry, presence: true
  validates :url, presence: true
end
