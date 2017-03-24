class AddEmailConfidenceToEntries < ActiveRecord::Migration[5.1]
  def change
    add_column :entries, :email_confidence, :integer, default: 0
    execute 'UPDATE entries SET email_confidence = 100 WHERE email IS NOT NULL'
  end
end
