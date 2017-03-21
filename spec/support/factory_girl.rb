require 'factory_girl_rails'

module FactoryGirl
  module Strategy
    class Stub
      private

      def next_id
        SecureRandom.uuid
      end
    end
  end
end

RSpec.configure do |config|
  config.include FactoryGirl::Syntax::Methods
end
