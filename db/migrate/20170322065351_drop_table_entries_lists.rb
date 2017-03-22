class DropTableEntriesLists < ActiveRecord::Migration[5.1]
  def change
    drop_table :entries_lists
  end
end
