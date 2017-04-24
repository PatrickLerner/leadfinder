require 'rails_helper'

describe EntrySerializer, type: :model do
  let(:sample) { build(:entry, company: build(:company)) }
  let(:serialization) { ActiveModelSerializers::SerializableResource.new(sample, serializer: described_class) }
  let(:subject) { JSON.parse(serialization.to_json).with_indifferent_access }

  describe '#company_cities' do
    it 'lists them as array' do
      sample.company.addresses = [build(:company_address, city: 'Hamburg')]
      expect(subject[:company_cities]).to eq(['Hamburg'])
    end

    it 'handles nil' do
      sample.company.addresses = [build(:company_address, city: nil), build(:company_address, city: 'Hamburg')]
      expect(subject[:company_cities]).to eq(['Hamburg'])
    end

    it 'handles empty' do
      sample.company.addresses = []
      expect(subject[:company_cities]).to eq([])
    end
  end
end
