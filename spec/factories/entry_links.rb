FactoryGirl.define do
  factory :entry_link, class: 'Entry::Link' do
    entry
    url Faker::Internet.url
  end
end
