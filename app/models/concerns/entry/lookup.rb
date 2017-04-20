class Entry < ApplicationRecord
  module Lookup
    extend ActiveSupport::Concern

    def determine_company!
      save! if determine_company
    end

    def determine_company
      return unless lookup_state == Entry::LOOKUP_STATE_SEARCHING_COMPANY
      return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_COMPANY) if company_name.blank?
      find_company!
      true
    end

    def determine_email!
      return unless lookup_state == Entry::LOOKUP_STATE_SEARCHING_EMAIL
      unless Company.allows_determination?
        return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_NOT_ATTEMPTED)
      end
      test_all_variants!
    rescue EmailVerifier::NoMailServerException
      update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_MX_RECORDS)
    rescue EmailVerifier::NotConnectedException, EmailVerifier::OutOfMailServersException,
           EmailVerifier::FailureException
      update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_CONNECTION)
    end

    protected

    def find_company!
      self.company ||= Company.find_by_name(company_name)
      self.company ||= Company::GooglePlacesLookup.lookup(company_name)
      if self.company.present?
        self.lookup_state = Entry::LOOKUP_STATE_COMPANY_FOUND
        self.company_name = company.name
        self.domain ||= company.domain
      else
        self.lookup_state = Entry::LOOKUP_STATE_FAILURE_COMPANY
      end
    end

    def variants
      %w(
        %{fn}.%{ln} %{fn} %{fn}%{ln} %{ln} %{fi}%{ln} %{fi}.%{ln} %{ln}%{fn}
        %{ln}.%{fn} %{ln}%{fi}
      ).map(&:downcase)
    end

    def format_for_email(value)
      value = value.downcase.gsub(/[äöü]/) do |c|
        { ä: 'ae', ö: 'oe', ü: 'ue' }[c.try(:to_sym)] || c
      end
      I18n.transliterate(value)
    end

    def email_from_pattern(pattern)
      email = format(
        pattern,
        fn: format_for_email(first_name),
        ln: format_for_email(last_name),
        fi: format_for_email(first_name[0]),
        li: format_for_email(last_name[0])
      )
      email += "@#{domain}"
      email.downcase
    end

    def test_all_variants!
      return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL) if test_allows_all?
      variants.each do |pattern|
        email = email_from_pattern(pattern)
        next unless EmailVerifier.check(email)
        return update_attributes(
          lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND,
          email: email, email_format: pattern, email_confidence: 100
        )
      end
      update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_NONE_VALID)
    end

    def test_allows_all?
      fake_email = "mixcael.sunwit@#{domain}"
      EmailVerifier.check(fake_email)
    end
  end
end
