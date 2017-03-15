class AddCompanyIdToEntries < ActiveRecord::Migration[5.1]
  def change
    rename_column :entries, :company, :company_name
    add_column :entries, :company_id, :uuid
    add_index :entries, :company_id
    add_foreign_key :entries, :companies
  end
end
