FactoryGirl.define do
  factory :entry do
    first_name Faker::Name.first_name
    last_name Faker::Name.last_name
    position Faker::Company.profession
    company_name Faker::Company.name
    company nil
    email nil
    user
  end
end
