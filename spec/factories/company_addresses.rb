FactoryGirl.define do
  factory :company_address, class: 'Company::Address' do
    city Faker::Address.city
    postal_code Faker::Address.postcode
    country Faker::Address.country
    region Faker::Address.state
    street_name Faker::Address.street_name
    street_number Faker::Address.building_number
  end
end
