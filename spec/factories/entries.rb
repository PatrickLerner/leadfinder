FactoryGirl.define do
  factory :entry do
    transient do
      with_lists 0
    end

    first_name Faker::Name.first_name
    last_name Faker::Name.last_name
    position Faker::Company.profession
    company_name Faker::Company.name
    company nil
    email nil
    domain nil
    user

    after(:build) do |entry, evaluator|
      entry.lists = build_list(:list, evaluator.with_lists, user: entry.user)
    end
  end
end
