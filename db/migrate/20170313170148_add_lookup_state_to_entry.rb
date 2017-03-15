class AddLookupStateToEntry < ActiveRecord::Migration[5.1]
  def change
    add_column :entries, :lookup_state, :string, null: false, default: 'unknown'
    add_index :entries, :lookup_state
  end
end
