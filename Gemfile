source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'active_model_serializers'
gem 'bourbon'
gem 'clearance'
gem 'dotenv-rails'
gem 'font-awesome-rails'
gem 'jbuilder', '~> 2.5'
gem 'neat'
gem 'pg', '~> 0.18'
gem 'puma', '~> 3.7'
gem 'rails', '~> 5.1.0.beta1'
gem 'responders'
gem 'sass-rails', github: "rails/sass-rails"
gem 'slim-rails'
gem 'uglifier', '>= 1.3.0'
gem 'webpacker', github: "rails/webpacker"

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'capybara', '~> 2.7.0'
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'letter_opener'
  gem 'rspec-rails', '~> 3.5'
  gem 'selenium-webdriver'
  gem 'shoulda-matchers'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end
