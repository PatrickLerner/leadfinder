require 'rails_helper'

describe Entry::Link, type: :model do
  it_behaves_like 'a model with factory'

  it { expect(subject).to validate_presence_of(:url) }
end
