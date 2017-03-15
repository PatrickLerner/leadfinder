class AddLowerNameIndexOnCompanies < ActiveRecord::Migration[5.1]
  def change
    execute "CREATE INDEX index_companies_on_lower_name
             ON companies USING btree (lower(name));"
  end
end
