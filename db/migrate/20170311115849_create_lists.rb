class CreateLists < ActiveRecord::Migration[5.1]
  def change
    create_table :lists, id: :uuid do |t|
      t.string :name, null: false
      t.string :sort_by, null: false
      t.uuid :user_id, null: false

      t.timestamps
    end

    add_foreign_key :lists, :users
  end
end
