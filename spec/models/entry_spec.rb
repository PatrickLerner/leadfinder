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
      expect(entry.email_confidence).to eq(100)
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_EMAIL_FOUND)
    end

    it 'replaces umlauts in names' do
      entry.assign_attributes(first_name: 'Ädelbert', last_name: 'Übermann')
      allow(EmailVerifier).to receive(:check) { |email| email == 'aedelbert.uebermann@bobington.bo' }
      entry.determine_email!
      expect(entry.email).to eq('aedelbert.uebermann@bobington.bo')
    end

    it 'sets the format on the entry if found' do
      allow(EmailVerifier).to receive(:check) { |email| email == 'bbobson@bobington.bo' }
      entry.determine_email!
      expect(entry.email_format).to eq('%{fi}%{ln}')
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

  describe '#destroy' do
    let!(:entry_count) { 1 }
    let!(:list_with_entries) { create(:list, with_entries: entry_count) }
    let!(:entries) { list_with_entries.entries }
    let!(:entry) { entries.first }

    it 'unassigns entries when deleting last list' do
      expect(entries.length).to eq(entry_count)
      expect(entry.lists.count).to eq(1)
      entry.destroy!
      expect(entries.count).to eq(0)
    end
  end

  describe '#filename' do
    let(:list) { build(:list, name: 'Potential Customers') }

    before(:each) { allow(Date).to receive(:today) { Date.parse('2017-03-22') } }

    it 'allows generating a filename' do
      expect(list.filename).to eq('potential_customers-2017-03-22')
    end

    it 'allows generating a filename with extension' do
      expect(list.filename(extension: 'csv')).to eq('potential_customers-2017-03-22.csv')
    end
  end

  describe '#schedule_next_action' do
    let(:entry) { build_stubbed(:entry) }

    it 'schedules company search after creation' do
      entry.send(:determine_next_action)
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_SEARCHING_COMPANY)
    end

    it 'schedules email search after company was found' do
      entry.lookup_state = Entry::LOOKUP_STATE_COMPANY_FOUND
      entry.send(:determine_next_action)
      expect(entry.lookup_state).to eq(Entry::LOOKUP_STATE_SEARCHING_EMAIL)
    end

    it 'otherwise simply tries to guess the email' do
      entry.lookup_state = Entry::LOOKUP_STATE_FAILURE_CONNECTION
      expect(entry).to receive(:guess_email!)
      entry.send(:determine_next_action)
    end
  end

  describe 'schedule_next_action' do
    let(:entry) { build_stubbed(:entry) }

    it 'runs the worker for company determination' do
      entry.lookup_state = Entry::LOOKUP_STATE_SEARCHING_COMPANY
      expect(EntryWorker).to receive(:perform_async) { |id, action|
        expect(action).to eq(:determine_company!)
        expect(id).to eq(entry.id)
      }
      entry.send(:schedule_next_action)
    end

    it 'runs the worker for email determination' do
      entry.lookup_state = Entry::LOOKUP_STATE_SEARCHING_EMAIL
      expect(EntryWorker).to receive(:perform_async) { |id, action|
        expect(action).to eq(:determine_email!)
        expect(id).to eq(entry.id)
      }
      entry.send(:schedule_next_action)
    end
  end

  describe 'lookup_info' do
    let(:entry) { build(:entry) }
    it 'reports if email was found' do
      entry.lookup_state = Entry::LOOKUP_STATE_EMAIL_FOUND
      expect(entry.lookup_info).to eq('email_found')
    end

    it 'reports if looking for mail' do
      [
        Entry::LOOKUP_STATE_UNKNOWN, Entry::LOOKUP_STATE_SEARCHING_COMPANY,
        Entry::LOOKUP_STATE_COMPANY_FOUND, Entry::LOOKUP_STATE_SEARCHING_EMAIL
      ].each do |state|
        entry.lookup_state = state
        expect(entry.lookup_info).to eq('processing')
      end
    end

    it 'reports if failure' do
      entry.lookup_state = Entry::LOOKUP_STATE_FAILURE_CONNECTION
      expect(entry.lookup_info).to eq('failure')
    end
  end

  describe '#most_common_format' do
    let(:company) { create(:company) }
    let(:other_company) { create(:company) }
    let(:company_format) { '%{fn}' }
    let(:common_format) { '%{fn}%{ln}' }
    before(:each) do
      8.times do |i|
        create(
          :entry,
          company: i < 3 ? company : other_company,
          email_format: i < 3 ? company_format : common_format,
          lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND
        )
      end
    end

    it 'knows the most common format in general' do
      expect(described_class.most_common_format).to eq(common_format)
    end

    it 'knows the most common format for the company' do
      expect(described_class.most_common_format(company)).to eq(company_format)
    end
  end

  describe '#guess_email!' do
    let(:company) { build_stubbed(:company, domain: 'example.com') }
    let(:entry) { build_stubbed(:entry, company: company) }

    before(:each) { allow(entry).to receive(:update_attributes) { |*args| entry.assign_attributes(*args) } }

    it 'does not overwrite an existing email' do
      entry.email = 'already@set'
      entry.guess_email!
      expect(entry.email).to eq('already@set')
    end

    it 'does not set if base confidence is already zero' do
      allow(entry).to receive(:base_confidence) { 0 }
      entry.guess_email!
      expect(entry.email).to be_nil
    end

    it 'builds on previously existing email to this company' do
      allow(entry).to receive(:base_confidence) { 50 }
      allow(Entry).to receive(:most_common_format) { '%{fn}' }
      entry.guess_email!
      expect(entry.email).to eq("#{entry.first_name.downcase}@example.com")
      expect(entry.email_confidence).to eq(50 * 1.5)
    end

    it 'builds on most common mail format' do
      allow(entry).to receive(:base_confidence) { 50 }
      allow(Entry).to receive(:most_common_format) { |company| company.nil? ? '%{fn}' : nil }
      entry.guess_email!
      expect(entry.email).to eq("#{entry.first_name.downcase}@example.com")
      expect(entry.email_confidence).to eq(50)
    end
  end

  describe '#name=' do
    it 'allows assigning a name' do
      entry = build_stubbed(:entry, name: 'Peter Miller')
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Miller')
    end

    it 'splits out titles' do
      ['Dr.', 'Dr.', 'Doctor', 'Prof.', 'Professor', 'Rev.'].each do |title|
        entry = build_stubbed(:entry, name: "#{title} Peter Miller")
        expect(entry.title).to eq(title)
        expect(entry.first_name).to eq('Peter')
        expect(entry.last_name).to eq('Miller')
      end
    end

    it 'splits multiple middle names' do
      entry = build_stubbed(:entry, name: 'Peter Martin Simon Miller')
      expect(entry.title).to eq('')
      expect(entry.middle_name).to eq('Martin Simon')
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Miller')
    end

    it 'splits multiple titles' do
      entry = build_stubbed(:entry, name: 'Prof. Dr. Peter Miller')
      expect(entry.title).to eq('Prof. Dr.')
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Miller')
    end

    it 'splits out middle names' do
      entry = build_stubbed(:entry, name: 'Peter Martin Miller')
      expect(entry.first_name).to eq('Peter')
      expect(entry.middle_name).to eq('Martin')
      expect(entry.last_name).to eq('Miller')
    end

    it 'parses unnecessairily complex names' do
      entry = build_stubbed(:entry, name: 'Prof. Dr Peter Martin Simon Miller')
      expect(entry.title).to eq('Prof. Dr')
      expect(entry.middle_name).to eq('Martin Simon')
      expect(entry.first_name).to eq('Peter')
      expect(entry.last_name).to eq('Miller')
    end
  end

  describe '#base_confidence' do
    it 'returns full confidence if actually found' do
      expect(build(:entry, lookup_state: Entry::LOOKUP_STATE_EMAIL_FOUND).send(:base_confidence)).to eq(100)
    end

    it 'returns confidence for connection failure' do
      expect(build(:entry, lookup_state: Entry::LOOKUP_STATE_FAILURE_CONNECTION).send(:base_confidence)).to be > 0
    end

    it 'returns confidence for accepts all failure' do
      expect(build(:entry, lookup_state: Entry::LOOKUP_STATE_FAILURE_ACCEPTS_ALL).send(:base_confidence)).to be > 0
    end

    it 'returns no confidence for other state' do
      expect(build(:entry, lookup_state: Entry::LOOKUP_STATE_FAILURE_COMPANY).send(:base_confidence)).to eq(0)
    end
  end

  describe '#urls' do
    let(:entry) { build_stubbed(:entry) }
    let(:url) { 'http://example.com/' }
    let(:url_count) { 3 }

    before(:each) do
      url_count.times do |i|
        entry.links.build(url: "#{url}#{i}")
      end
    end

    it 'returns the correct urls' do
      expect(entry.links.length).to eq(url_count)
      expect(entry.urls.length).to eq(url_count)
    end
  end

  describe '#urls=' do
    let(:entry) { build_stubbed(:entry) }
    let(:url) { 'http://example.com/' }

    it 'allows to assign urls as an array' do
      entry.urls = [url]
      entry.send(:persist_urls)
      expect(entry.urls.count).to eq(1)
      expect(entry.urls).to eq([url])
      expect(entry.links.length).to eq(1)
      expect(entry.links.first.url).to eq(url)
    end

    it 'removes urls on save' do
      entry.links.build(url: url)
      expect(entry.links.length).to eq(1)
      entry.urls = []
      entry.send(:persist_urls)
      expect(entry.links.first).to be_marked_for_destruction
    end
  end
end
