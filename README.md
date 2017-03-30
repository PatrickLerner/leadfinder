<p align="center"><img src='https://github.com/PatrickLerner/leadfinder/blob/master/app/assets/images/logo.png?raw=true' alt='Lead Finder Logo' /></p>

# Lead Finder

## Software Requirements

  * Ruby 2.3
  * Rails 5.1
  * Postgresql
  * Redis
  * Elasticsearch

## Development Setup

1. Create .env file with the following keys: `GOOGLE_PLACES_API_KEY`, `HUNTER_IO_API_KEY`
2. Copy `config/database.example.yml` to `config.database.yml` and adjust
3. Always run `bin/foreman start` (or `bin/rails server` AND `bin/webpack-watcher` AND `bundle exec sidekiq`)

## Coverage

Run `coverage=true bin/rspec spec` to see a unit test coverage report.
