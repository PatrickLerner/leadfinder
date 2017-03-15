module Entry::Lookup
  extend ActiveSupport::Concern

  included do
    before_save :determine_next_action, unless: -> { Rails.env.test? }
    after_save :schedule_next_action, unless: -> { Rails.env.test? }
  end

  def determine_company!
    return unless lookup_state == Entry::LOOKUP_STATE_SEARCHING_COMPANY
    return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_COMPANY) if company_name.blank?

    self.company ||= Company.find_by_name(company_name)
    self.company ||= Company::GooglePlacesLookup.lookup(company_name)

    self.lookup_state = self.company.present? ? Entry::LOOKUP_STATE_COMPANY_FOUND : Entry::LOOKUP_STATE_FAILURE_COMPANY
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
  rescue EmailVerifier::NotConnectedException, EmailVerifier::OutOfMailServersException, EmailVerifier::FailureException
    update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_CONNECTION)
  end

  protected

  def schedule_next_action
    EntryWorker.perform_async(id, :determine_company!) if lookup_state == Entry::LOOKUP_STATE_SEARCHING_COMPANY
    EntryWorker.perform_async(id, :determine_email!) if lookup_state == Entry::LOOKUP_STATE_SEARCHING_EMAIL
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
    [
      "#{first_name}.#{last_name}@#{company.domain}",
      "#{first_name}@#{company.domain}"
    ].map(&:downcase)
  end

  def test_all_variants!
    return update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL) if test_allows_all?
    variants.each do |email|
      next unless EmailVerifier.check(email)
      return update_attributes(lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND, email: email)
    end
    update_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_NONE_VALID)
  end

  def test_allows_all?
    fake_email = "mixcael.sunwit@#{company.domain}"
    EmailVerifier.check(fake_email)
  end
end
