class Entry < ApplicationRecord
  module Guess
    extend ActiveSupport::Concern

    def guess_email!
      return if email.present?
      return if base_confidence.zero?
      guess_email_format!
      return unless email_format.present?
      update_attributes(
        email: email_from_pattern(email_format),
        email_confidence: email_confidence,
        email_format: email_format
      )
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

    def guess_email_format!
      self.email_confidence = base_confidence
      guess_email_hunterio! || guess_email_previous_entry! || guess_email_common!
    end

    def guess_email_hunterio!
      self.email_format = Company::Hunterio.find_domain(domain).try(:pattern)
      self.email_confidence *= 1.5 if email_format.present?
      email_format.present?
    end

    def guess_email_previous_entry!
      self.email_format = Entry.most_common_format(company)
      self.email_confidence *= 1.5 if email_format.present?
      email_format.present?
    end

    def guess_email_common!
      self.email_format = Entry.most_common_format
      email_format.present?
    end

    def base_confidence
      {
        Entry::LOOKUP_STATE_EMAIL_FOUND => 100,
        Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL => 60,
        Entry::LOOKUP_STATE_FAILURE_NONE_VALID => 50,
        Entry::LOOKUP_STATE_FAILURE_CONNECTION => 40
      }[lookup_state] || 0
    end
  end
end
