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

    protected

    def add_duplicate_to_lists!
      list_ids.each do |list|
        ListChannel.add_entry_to_list(duplicate, list) unless list.in?(duplicate.list_ids)
      end
      duplicate.list_ids = (duplicate.list_ids + list_ids).uniq
    end

    def duplicate
      @duplicate ||= Entry.where(
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        company_name: company_name
      ).where.not(id: id).first
    end
  end
end
