class CreateCompanyAddresses < ActiveRecord::Migration[5.1]
  def change
    create_table :company_addresses, id: :uuid do |t|
      t.uuid :company_id, null: false
      t.string :city
      t.string :postal_code
      t.string :country
      t.string :region
      t.string :street_name
      t.string :street_number

      t.timestamps
    end
    add_index :company_addresses, :city
    add_index :company_addresses, :country
    add_index :company_addresses, :region
    add_index :company_addresses, :company_id
    add_foreign_key :company_addresses, :companies
  end
end
