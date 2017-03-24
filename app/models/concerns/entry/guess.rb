class Entry < ApplicationRecord
  module Guess
    extend ActiveSupport::Concern

    def guess_email!
      return if email.present?
      return if base_confidence.zero?

      email_format = Entry.most_common_format(company)
      email_confidence = base_confidence
      if email_format.nil?
        email_format = Entry.most_common_format
      else
        email_confidence *= 1.5
      end
      update_attributes(email: email_from_variant(email_format), email_confidence: email_confidence)
    end

    class_methods do
      def most_common_format(company = nil)
        scope = company.present? ? Entry.where(company: company) : Entry
        scope.select('email_format, COUNT(id) as count')
             .where(lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND)
             .group('email_format').order('count DESC')
             .first.try(:email_format)
      end
    end

    protected

    def base_confidence
      case lookup_state
      when Entry::LOOKUP_STATE_EMAIL_FOUND
        100
      when Entry::LOOKUP_STATE_FAILURE_CONNECTION
        40
      when Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL
        60
      else
        0
      end
    end
  end
end
