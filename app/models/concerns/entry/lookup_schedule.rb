class Entry < ApplicationRecord
  module LookupSchedule
    extend ActiveSupport::Concern

    included do
      before_save :determine_next_action, unless: -> { Rails.env.test? }
      after_commit :schedule_next_action, on: %i(create update), unless: -> { Rails.env.test? }
    end

    class_methods do
      def lookup_inline!(entry_params)
        entry = find_or_initialize_by(entry_params)
        return false unless entry.valid?
        entry.determine_company
        return false unless entry.lookup_state == Entry::LOOKUP_STATE_COMPANY_FOUND
        return entry.duplicate if entry.duplicate?
        entry.determine_email
        entry.guess_email
        entry.save!
        entry
      end
    end

    protected

    def schedule_next_action
      EntryWorker.perform_async(id, next_action) if next_action.present?
    end

    def next_action
      case lookup_state
      when Entry::LOOKUP_STATE_SEARCHING_COMPANY
        :determine_company!
      when Entry::LOOKUP_STATE_SEARCHING_EMAIL
        :determine_email!
      when Entry::LOOKUP_STATE_DUPLICATE
        :remove_as_duplicate!
      end
    end

    def determine_next_action
      case lookup_state
      when Entry::LOOKUP_STATE_UNKNOWN
        self.lookup_state = Entry::LOOKUP_STATE_SEARCHING_COMPANY
      when Entry::LOOKUP_STATE_COMPANY_FOUND
        self.lookup_state = duplicate? ? Entry::LOOKUP_STATE_DUPLICATE : Entry::LOOKUP_STATE_SEARCHING_EMAIL
      else
        guess_email!
      end
    end
  end
end
