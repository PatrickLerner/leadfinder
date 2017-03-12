FactoryGirl.define do
  factory :entry do
    first_name Faker::Name.first_name
    last_name Faker::Name.last_name
    position Faker::Company.profession
    company Faker::Company.name
    email Faker::Internet.safe_email
    user
  end
end
