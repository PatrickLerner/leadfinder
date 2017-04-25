class Entry < ApplicationRecord
  module Duplicate
    extend ActiveSupport::Concern

    def duplicate?
      duplicate.present?
    end

    def remove_as_duplicate!
      add_duplicate_to_lists!
      destroy!
    end

    def duplicate
      @duplicate ||=
        Entry.where(user_id: user_id).where.not(id: id).where(
          'LOWER(first_name) = ? AND LOWER(last_name) = ? AND LOWER(company_name) = ?',
          first_name.downcase, last_name.downcase, company_name.downcase
        ).first
    end

    protected

    def add_duplicate_to_lists!
      list_ids.each do |list|
        ListChannel.add_entry_to_list(duplicate, list) unless list.in?(duplicate.list_ids)
      end
      duplicate.list_ids = (duplicate.list_ids + list_ids).uniq
    end
  end
end
