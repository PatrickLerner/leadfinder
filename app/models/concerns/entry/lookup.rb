class Entry < ApplicationRecord
  module Lookup
    extend ActiveSupport::Concern

    def determine_company!
      return unless lookup_state == Entry::LOOKUP_STATE_SEARCHING_COMPANY
      save! if determine_company
    end

    def determine_company
      if company_name.blank?
        self.lookup_state = Entry::LOOKUP_STATE_FAILURE_COMPANY
        return false
      else
        find_company
      end
      true
    end

    def determine_email!
      return unless lookup_state == Entry::LOOKUP_STATE_SEARCHING_EMAIL
      save! if determine_email
    end

    def determine_email
      return unless check_company_determination

      begin
        test_all_variants
      rescue EmailVerifier::NoMailServerException
        self.lookup_state = Entry::LOOKUP_STATE_FAILURE_MX_RECORDS
      rescue EmailVerifier::NotConnectedException, EmailVerifier::OutOfMailServersException,
             EmailVerifier::FailureException, Net::SMTPFatalError, EOFError
        self.lookup_state = Entry::LOOKUP_STATE_FAILURE_CONNECTION
      end
      true
    end

    protected

    def check_company_determination
      return true if Company.allows_determination?
      self.lookup_state = Entry::LOOKUP_STATE_FAILURE_NOT_ATTEMPTED
      false
    end

    def find_company
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

    def test_all_variants
      if test_allows_all?
        self.lookup_state = Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL
        return true
      end
      variants.each do |pattern|
        return true if test_variant(pattern)
      end
      self.lookup_state = Entry::LOOKUP_STATE_FAILURE_NONE_VALID
      true
    end

    def test_variant(pattern)
      email = email_from_pattern(pattern)
      return false unless EmailVerifier.check(email)
      assign_attributes(
        lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND,
        email: email, email_format: pattern, email_confidence: 100
      )
      true
    end

    def test_allows_all?
      fake_email = "mixcael.sunwit@#{domain}"
      EmailVerifier.check(fake_email)
    end
  end
end
