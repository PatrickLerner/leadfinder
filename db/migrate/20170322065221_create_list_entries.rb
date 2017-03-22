class CreateListEntries < ActiveRecord::Migration[5.1]
  def change
    create_table :list_entries, id: :uuid do |t|
      t.uuid :list_id
      t.uuid :entry_id
      t.timestamps
    end

    add_foreign_key :list_entries, :lists
    add_foreign_key :list_entries, :entries
  end
end
