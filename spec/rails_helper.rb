# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
# Prevent database truncation if the environment is production
abort('The Rails environment is running in production mode!') if Rails.env.production?
require 'spec_helper'
require 'rspec/rails'

if ENV['coverage']
  require 'simplecov'
  require 'launchy'
  SimpleCov.start do
    add_group 'Controllers', 'app/controllers'
    add_group 'Models', 'app/models'
    add_group 'Workers', 'app/workers'
    add_group 'Other', %w(db lib)
    add_filter '/spec/'
    add_filter '/config/'
    add_filter '/seeds/'
  end

  SimpleCov.at_exit do
    SimpleCov.result.format!
    Launchy.open('coverage/index.html')
  end
end

# Add additional requires below this line. Rails is not loaded until this point!
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }
require 'clearance/rspec'

ActiveRecord::Migration.maintain_test_schema!

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
