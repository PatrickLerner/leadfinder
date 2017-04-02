class AddDomainToEntries < ActiveRecord::Migration[5.1]
  def change
    add_column :entries, :domain, :string
  end
end
