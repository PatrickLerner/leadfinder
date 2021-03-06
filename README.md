# Lead Finder

Lead Finder is a in-development project aimed to facilitate finding and managing leads for marketing purposes. In particular it aims to resolve email addresses of found contact data automatically.

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

## Deployment

1. Requires access as deployer user on production server
2. Run `cap production deploy`

## Coverage

Run `coverage=true bin/rspec spec` to see a unit test coverage report.
