class Entry < ApplicationRecord
  module LookupState
    extend ActiveSupport::Concern

    LOOKUP_STATES = [
      LOOKUP_STATE_UNKNOWN = :unknown,
      LOOKUP_STATE_SEARCHING_COMPANY = :searching_company,
      LOOKUP_STATE_COMPANY_FOUND = :company_found,
      LOOKUP_STATE_SEARCHING_EMAIL = :searching_email,
      LOOKUP_STATE_EMAIL_FOUND = :email_found,
      LOOKUP_STATE_FAILURE_COMPANY = :failure_company,
      LOOKUP_STATE_FAILURE_MX_RECORDS = :failure_mx_records,
      LOOKUP_STATE_FAILURE_CONNECTION = :failure_connection,
      LOOKUP_STATE_FAILURE_ACCEPTS_ALL = :failure_accepts_all,
      LOOKUP_STATE_FAILURE_NONE_VALID = :failure_none_valid,
      LOOKUP_STATE_FAILURE_NOT_ATTEMPTED = :failure_not_attempted
    ].freeze

    LOOKUP_STATES_FAILURE = [
      LOOKUP_STATE_FAILURE_COMPANY,
      LOOKUP_STATE_FAILURE_MX_RECORDS,
      LOOKUP_STATE_FAILURE_CONNECTION,
      LOOKUP_STATE_FAILURE_ACCEPTS_ALL,
      LOOKUP_STATE_FAILURE_NONE_VALID,
      LOOKUP_STATE_FAILURE_NOT_ATTEMPTED
    ].freeze

    included do
      before_save :need_update_lists?
      before_save :should_research?
      after_save :update_lists!, if: -> { @update_lists }

      validates :lookup_state, inclusion: { in: LOOKUP_STATES }, presence: true
    end

    def lookup_state
      read_attribute(:lookup_state).try(:to_sym)
    end

    def lookup_info
      case lookup_state
      when LOOKUP_STATE_EMAIL_FOUND
        'email_found'
      when LOOKUP_STATE_UNKNOWN, LOOKUP_STATE_SEARCHING_COMPANY,
           LOOKUP_STATE_COMPANY_FOUND, LOOKUP_STATE_SEARCHING_EMAIL
        'processing'
      else
        'failure'
      end
    end

    protected

    def should_research?
      return false if lookup_state_changed?
      return false unless lookup_state.in?(LOOKUP_STATES_FAILURE)
      return false if found_email?
      return unless email_component_changed? && all_email_components_present?
      self.lookup_state = Entry::LOOKUP_STATE_SEARCHING_EMAIL
    end

    def found_email?
      email_confidence == 100 && email.present?
    end

    def email_component_changed?
      first_name_changed? || last_name_changed? || domain_changed?
    end

    def all_email_components_present?
      first_name.present? && last_name.present? && domain.present?
    end

    def need_update_lists?
      @update_lists = changed?
    end

    def update_lists!
      (lists.map(&:id).presence || %i(inbox)).each do |list_id|
        ListChannel.update_entry_in_list(self, list_id)
      end
      @update_lists = false
      true
    end
  end
end
