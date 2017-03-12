FactoryGirl.define do
  factory :user do
    sequence :first_name do |n|
      "#{Faker::Name.first_name}#{n}"
    end
    sequence :last_name do |n|
      "#{Faker::Name.last_name}#{n}"
    end
    gender %i(male female).sample
    sequence :email do |n|
      Faker::Internet.safe_email("#{Faker::Internet.user_name}#{n}")
    end
    password(password = Faker::Internet.password)
  end
end
