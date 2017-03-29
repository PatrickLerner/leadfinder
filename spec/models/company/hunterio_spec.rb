require 'rails_helper'

describe Company::Hunterio, type: :model do
  it_behaves_like 'a model with factory'

  it { expect(subject).to validate_presence_of(:domain) }
  it { expect(subject).to validate_uniqueness_of(:domain) }
  it { expect(subject).to validate_presence_of(:response) }

  describe '#response' do
    let(:hunterio) { build_stubbed(:company_hunterio) }

    it 'returns as json' do
      expect(hunterio.response.class).to eq(Hash)
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
  end
end
