FactoryGirl.define do
  factory :list do
    transient do
      with_entries 0
    end

    name "#{Faker::Company.buzzword} Customers"
    sort_by :created_at
    user

    after(:build) do |list, evaluator|
      list.entries = build_list(:entry, evaluator.with_entries, user: list.user)
    end
  end
end
