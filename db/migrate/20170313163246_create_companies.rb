class CreateCompanies < ActiveRecord::Migration[5.1]
  def change
    create_table :companies, id: :uuid do |t|
      t.string :name
      t.string :domain

      t.timestamps
    end
    add_index :companies, :name
  end
end
