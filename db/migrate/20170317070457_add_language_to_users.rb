class AddLanguageToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :language, :string, default: 'en', null: false
    add_index :users, :language
  end
end
