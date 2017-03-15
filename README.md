# Lead Finder

## Development Setup

1. Create .env file with the following keys: `GOOGLE_PLACES_API_KEY`
2. Copy `config/database.example.yml` to `config.database.yml` and adjust
3. Always run `bin/rails server` AND `bin/webpack-watcher` AND `bundle exec sidekiq`

## Coverage

Run `coverage=true bin/rspec spec` to see a unit test coverage report.
