FactoryGirl.define do
  factory :company_hunterio, class: 'Company::Hunterio' do
    domain Faker::Internet.domain_name
    response do
      file_name = Rails.root.join(*%w(spec support responses hunter_io domain_search.json))
      JSON.parse(File.read(file_name))
    end
  end
end
