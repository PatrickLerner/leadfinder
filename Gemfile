source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'active_model_serializers'
gem 'addressable'
gem 'autoprefixer-rails'
gem 'bourbon'
gem 'clearance'
gem 'dotenv-rails'
gem 'email_verifier'
gem 'font-awesome-sass'
gem 'google_places'
gem 'hunterio'
gem 'jbuilder'
gem 'neat'
gem 'pg'
gem 'puma'
gem 'rack-cors', require: 'rack/cors'
gem 'rails', '~> 5.1.0.rc1'
gem 'responders'
gem 'sass-rails', github: 'rails/sass-rails'
gem 'sidekiq'
gem 'slim-rails'
gem 'therubyracer'
gem 'uglifier'
gem 'webpacker', github: 'rails/webpacker'

group :development, :test do
  gem 'byebug', platforms: %i(mri mingw x64_mingw)
  gem 'capybara'
  gem 'email_spec'
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'foreman'
  gem 'poltergeist'
  gem 'reek'
  gem 'rspec-rails', '~> 3.5'
  gem 'rubocop'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers'
  gem 'simplecov', require: false
  gem 'webmock'
end

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'capistrano',         require: false
  gem 'capistrano-bundler', require: false
  gem 'capistrano-rails',   require: false
  gem 'capistrano-rvm',     require: false
  gem 'capistrano-sidekiq', require: false
  gem 'capistrano3-puma',   require: false
  gem 'letter_opener'
  gem 'listen'
  gem 'spring'
  gem 'spring-watcher-listen'
  gem 'web-console'
end
