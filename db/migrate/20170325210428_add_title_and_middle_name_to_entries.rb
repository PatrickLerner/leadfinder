class AddTitleAndMiddleNameToEntries < ActiveRecord::Migration[5.1]
  def change
    add_column :entries, :title, :string
    add_column :entries, :middle_name, :string
  end
end
