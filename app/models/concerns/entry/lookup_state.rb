module Entry::LookupState
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

  included do
    validates :lookup_state, inclusion: { in: LOOKUP_STATES }, presence: true
  end

  def lookup_state
    read_attribute(:lookup_state).try(:to_sym)
  end
end
