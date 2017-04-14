class ListSerializer < ActiveModel::Serializer
  attributes :id, :name, :sort_by

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
    object.entries.order(created_at: :desc).offset(offset).limit(PER_PAGE)
  end

  def entries_meta
    {
      page: (@page.presence || 1).to_i,
      per_page: PER_PAGE,
      total_pages: [(object.entries.count.to_f / PER_PAGE.to_f).ceil, 1].max
    }
  end
end
