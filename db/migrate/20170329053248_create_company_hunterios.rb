class CreateCompanyHunterios < ActiveRecord::Migration[5.1]
  def change
    create_table :company_hunterios, id: :uuid do |t|
      t.string :domain
      t.text :response

      t.timestamps
    end
    add_index :company_hunterios, :domain
  end
end
