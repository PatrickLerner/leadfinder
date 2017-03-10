shared_examples 'a model with factory' do
  describe 'factory' do
    it 'is valid' do
      factory_symbol = described_class.name.gsub('::', '_').underscore.to_sym
      expect(build(factory_symbol)).to be_valid
    end
  end
end
