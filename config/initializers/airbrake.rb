Airbrake.configure do |config|
  config.environment = Rails.env
  config.ignore_environments = %w(development test cucumber)
  config.host = 'https://exceptions.codebasehq.com'
  config.project_key = 'cb832a9a-720e-2b40-daec-c494f947f8ea'
  config.project_id = 176_161
end
