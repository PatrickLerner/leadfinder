require 'rails_helper'

describe Entry, type: :model do
  it_behaves_like 'a model with factory'

  it { expect(subject).to validate_presence_of(:first_name) }
  it { expect(subject).to validate_presence_of(:last_name) }
  it { expect(subject).to validate_presence_of(:company_name) }
  it { expect(subject).to validate_presence_of(:lookup_state) }

  describe '#determine_company!' do
    let(:fake_company) { build(:company) }

    subject { build(:entry, lookup_state: Entry::LOOKUP_STATE_SEARCHING_COMPANY) }

    it 'does nothing if status is not `searching company`' do
      expect(subject).to_not receive(:save!)
      subject.assign_attributes(lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND)
      subject.determine_company!
      expect(subject.company).to be_nil
      expect(subject.lookup_state).to eq(Entry::LOOKUP_STATE_EMAIL_FOUND)
    end

    it 'does nothing if company_name is empty' do
      expect(subject).to_not receive(:save!)
      subject.assign_attributes(company_name: '')
      subject.determine_company!
      expect(subject.company).to be_nil
      expect(subject.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_COMPANY)
    end

    it 'does nothing if company already set' do
      expect(subject).to receive(:save!)
      subject.assign_attributes(company: fake_company)
      subject.determine_company!
      expect(subject.company).to eq(fake_company)
      expect(subject.lookup_state).to eq(Entry::LOOKUP_STATE_COMPANY_FOUND)
    end

    it 'gets company from previous entries' do
      expect(subject).to receive(:save!)
      allow(Company).to receive(:find_by_name) { fake_company }
      subject.determine_company!
      expect(subject.company).to eq(fake_company)
      expect(subject.lookup_state).to eq(Entry::LOOKUP_STATE_COMPANY_FOUND)
    end

    it 'queries google api' do
      expect(subject).to receive(:save!)
      expect(Company::GooglePlacesLookup).to receive(:lookup) { fake_company }
      allow(Company).to receive(:find_by_name).and_return(nil)
      subject.determine_company!
      expect(subject.company).to eq(fake_company)
      expect(subject.lookup_state).to eq(Entry::LOOKUP_STATE_COMPANY_FOUND)
    end

    it 'sets error state if no result found' do
      expect(subject).to receive(:save!)
      expect(Company::GooglePlacesLookup).to receive(:lookup) { nil }
      allow(Company).to receive(:find_by_name).and_return(nil)
      subject.determine_company!
      expect(subject.company).to be_nil
      expect(subject.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_COMPANY)
    end
  end

  describe 'determine_email!' do
    let!(:company) { build(:company, domain: 'bobington.bo') }
    let!(:entry) do
      build(:entry, first_name: 'bob', last_name: 'bobson', company: company,
                    lookup_state: Entry::LOOKUP_STATE_SEARCHING_EMAIL)
    end

    before(:each) { allow(entry).to receive(:save!) }

    it 'finds the mail' do
      allow(EmailVerifier).to receive(:check) { |email| email == 'bob.bobson@bobington.bo' }
      entry.determine_email!
      expect(entry.email).to eq('bob.bobson@bobington.bo')
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_EMAIL_FOUND)
    end

    it 'does nothing if status is not `searching email`' do
      entry.assign_attributes(lookup_state: Entry::LOOKUP_STATE_FAILURE_COMPANY, email: nil)
      entry.determine_email!
      expect(entry.email).to be_nil
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_COMPANY)
    end

    it 'fails if company domain has no mx records' do
      allow(EmailVerifier).to receive(:check).and_raise(EmailVerifier::NoMailServerException)
      entry.determine_email!
      expect(entry.email).to be_nil
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_MX_RECORDS)
    end

    it 'fails if there are connection issues' do
      allow(EmailVerifier).to receive(:check).and_raise(EmailVerifier::FailureException)
      entry.determine_email!
      expect(entry.email).to be_nil
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_CONNECTION)
    end

    it 'fails if company is known to not work' do
      allow(Company).to receive(:allows_determination?) { false }
      entry.determine_email!
      expect(entry.email).to be_nil
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_NOT_ATTEMPTED)
    end

    it 'fails if accepts any mail' do
      allow(EmailVerifier).to receive(:check) { true }
      entry.determine_email!
      expect(entry.email).to be_nil
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL)
    end

    it 'fails if accepts no variant' do
      allow(EmailVerifier).to receive(:check) { false }
      entry.determine_email!
      expect(entry.email).to be_nil
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_FAILURE_NONE_VALID)
    end
  end
end
