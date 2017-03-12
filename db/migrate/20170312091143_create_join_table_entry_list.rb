class CreateJoinTableEntryList < ActiveRecord::Migration[5.1]
  def change
    create_table :entries_lists, id: false do |t|
      t.uuid :entry_id, null: false
      t.uuid :list_id, null: false
    end

    add_index :entries_lists, [:entry_id, :list_id]
    add_index :entries_lists, [:list_id, :entry_id]
    add_foreign_key :entries_lists, :entries
    add_foreign_key :entries_lists, :lists
  end
end
