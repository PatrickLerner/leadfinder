require 'rails_helper'

describe Company, type: :model do
  it_behaves_like 'a model with factory'

  it { expect(subject).to validate_presence_of(:name) }
  it { expect(subject).to validate_presence_of(:domain) }

  describe '#find_by_name' do
    it 'returns first_matching by lowercased name' do
      company = build(:company)
      expect(Company).to receive(:where) do |query|
        expect(query).to include('lower(name)')
        [company]
      end
      expect(Company.find_by_name('test')).to eq(company)
    end
  end
end
