class CreateEntries < ActiveRecord::Migration[5.1]
  def change
    create_table :entries, id: :uuid do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :position
      t.string :company, null: false
      t.string :email
      t.uuid :user_id, null: false

      t.timestamps
    end

    add_foreign_key :entries, :users
  end
end
