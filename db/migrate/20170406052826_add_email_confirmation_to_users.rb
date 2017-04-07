class AddEmailConfirmationToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :email_confirmation_token, :string, null: false, default: ''
    add_index :users, :email_confirmation_token
    add_column :users, :email_confirmed_at, :datetime
  end
end
