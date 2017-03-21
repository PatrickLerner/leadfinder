class Entry < ApplicationRecord
  module Lookup
    extend ActiveSupport::Concern

    included do
      before_save :determine_next_action, unless: -> { Rails.env.test? }
      after_commit :schedule_next_action, on: [:create, :update], unless: -> { Rails.env.test? }
    end

    def determine_company!
      return unless lookup_state == Entry::LOOKUP_STATE_SEARCHING_COMPANY
      return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_COMPANY) if company_name.blank?

      self.company ||= Company.find_by_name(company_name)
      self.company ||= Company::GooglePlacesLookup.lookup(company_name)

      self.lookup_state = if self.company.present?
                            Entry::LOOKUP_STATE_COMPANY_FOUND
                          else
                            Entry::LOOKUP_STATE_FAILURE_COMPANY
                          end
      save!
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

    def schedule_next_action
      case lookup_state
      when Entry::LOOKUP_STATE_SEARCHING_COMPANY
        EntryWorker.perform_async(id, :determine_company!)
      when Entry::LOOKUP_STATE_SEARCHING_EMAIL
        EntryWorker.perform_async(id, :determine_email!)
      end
    end

    def determine_next_action
      case lookup_state
      when Entry::LOOKUP_STATE_UNKNOWN
        self.lookup_state = Entry::LOOKUP_STATE_SEARCHING_COMPANY
      when Entry::LOOKUP_STATE_COMPANY_FOUND
        self.lookup_state = Entry::LOOKUP_STATE_SEARCHING_EMAIL
      end
    end

    def variants
      %w(
        %{fn}.%{ln}
        %{fn}
        %{fn}%{ln}
        %{ln}
        %{fi}%{ln}
        %{ln}%{fn}
        %{ln}.%{fn}
        %{ln}%{fi}
      ).map(&:downcase)
    end

    def format_for_email(value)
      value.downcase.gsub(/[äöüß]/) do |c|
        { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c.try(:to_sym)] || c
      end
    end

    def email_from_variant(variant)
      email = variant % {
        fn: format_for_email(first_name),
        ln: format_for_email(last_name),
        fi: format_for_email(first_name[0]),
        li: format_for_email(last_name[0])
      }
      email += "@#{company.domain}"
      email.downcase
    end

    def test_all_variants!
      return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL) if test_allows_all?
      variants.each do |variant|
        email = email_from_variant(variant)
        next unless EmailVerifier.check(email)
        return update_attributes(lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND, email: email, email_format: variant)
      end
      update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_NONE_VALID)
    end

    def test_allows_all?
      fake_email = "mixcael.sunwit@#{company.domain}"
      EmailVerifier.check(fake_email)
    end
  end
end
