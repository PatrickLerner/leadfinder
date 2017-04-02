require 'rails_helper'
require 'hunter'

describe Company::Hunterio, type: :model do
  it_behaves_like 'a model with factory'

  it { expect(subject).to validate_presence_of(:domain) }
  it { expect(subject).to validate_uniqueness_of(:domain) }
  it { expect(subject).to validate_presence_of(:response) }

  describe '#response' do
    let(:hunterio) { build_stubbed(:company_hunterio) }

    it 'returns as json' do
      expect(hunterio.response.class).to eq(ActiveSupport::HashWithIndifferentAccess)
    end
  end

  describe '#response=' do
    let(:json) { { status: :error } }
    let(:hunterio) { build_stubbed(:company_hunterio, response: json) }

    it 'returns as json' do
      expect(hunterio.send(:read_attribute, :response)).to eq(json.to_json)
    end
  end

  describe '#find_domain' do
    let(:hunterio) { build_stubbed(:company_hunterio) }

    describe 'cached' do
      before(:each) do
        allow(described_class).to receive(:find_or_initialize_by) { |options|
          expect(options[:domain]).to eq(hunterio.domain)
          hunterio
        }
      end

      it 'returns a cached response if it already exists' do
        expect(described_class.find_domain(hunterio.domain).response).to eq(hunterio.response)
      end
    end

    describe 'not cached' do
      let(:hunter_response) do
        file_name = Rails.root.join(*%w(spec support responses hunter_io domain_search.json))
        JSON.parse(File.read(file_name)).with_indifferent_access[:data]
      end

      before(:each) do
        expect(Hunter).to receive(:new) { |key|
          expect(key).to eq(Rails.application.secrets.hunter_io_api)
          api = double
          expect(api).to receive(:domain_search) { |url|
            if url == 'instaffo.com'
              Struct.new(*hunter_response.keys.map(&:to_sym)).new(*hunter_response.values)
            else
              nil
            end
          }
          api
        }
      end

      it 'calls the hunter api for a result' do
        expect(described_class.find_domain('instaffo.com').pattern).to eq('%{fn}')
      end

      it 'returns nil if the hunter api does not respond' do
        expect(described_class.find_domain('launchfactory.net').pattern).to be_nil
      end
    end
  end

  describe '#pattern' do
    let(:hunterio) { build_stubbed(:company_hunterio) }

    it 'extracts the pattern from the response' do
      expect(hunterio.pattern).to eq('%{fn}')
    end

    it 'correctly transforms hunter.io style pattern' do
      allow(hunterio).to receive(:response) { { pattern: '{first}.{l}.{last}.{f}' } }
      expect(hunterio.pattern).to eq('%{fn}.%{li}.%{ln}.%{fi}')
    end

    it 'returns nil if it does not exist' do
      hunterio.response = {}
      expect(hunterio.pattern).to be_nil
    end
  end
end
