class CreateEntryLinks < ActiveRecord::Migration[5.1]
  def change
    create_table :entry_links, id: :uuid do |t|
      t.uuid :entry_id, null: false
      t.string :url, null: false

      t.timestamps
    end

    add_foreign_key :entry_links, :entries
  end
end
