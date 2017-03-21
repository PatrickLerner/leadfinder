class AddEmailFormatToEntry < ActiveRecord::Migration[5.1]
  def change
    add_column :entries, :email_format, :string
    add_index :entries, :email_format
  end
end
