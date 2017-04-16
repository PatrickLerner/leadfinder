class ListSerializer < ActiveModel::Serializer
  attributes :id, :name, :sort_by, :entry_count, :created_at

  has_many :entries_meta
  has_many :entries
  belongs_to :user

  PER_PAGE = 50

  def initialize(object, options)
    super
    @page = options[:page]
  end

  def entries
    offset = ((@page.presence || 1).to_i - 1) * PER_PAGE
    object.list_entries.includes(:entry).order(created_at: :desc).offset(offset).limit(PER_PAGE).map(&:entry)
  end

  def entries_meta
    {
      page: (@page.presence || 1).to_i,
      per_page: PER_PAGE,
      total_pages: [(object.entries.count.to_f / PER_PAGE.to_f).ceil, 1].max
    }
  end

  def entry_count
    object.list_entries.count
  end
end
