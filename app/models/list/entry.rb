class List::Entry < ApplicationRecord
  belongs_to :entry, class_name: '::Entry'
  belongs_to :list
end
