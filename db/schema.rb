# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170331053829) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pgcrypto"

  create_table "companies", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "domain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((name)::text)", name: "index_companies_on_lower_name"
    t.index ["name"], name: "index_companies_on_name"
  end

  create_table "company_addresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "company_id", null: false
    t.string "city"
    t.string "postal_code"
    t.string "country"
    t.string "region"
    t.string "street_name"
    t.string "street_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city"], name: "index_company_addresses_on_city"
    t.index ["company_id"], name: "index_company_addresses_on_company_id"
    t.index ["country"], name: "index_company_addresses_on_country"
    t.index ["region"], name: "index_company_addresses_on_region"
  end

  create_table "company_hunterios", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "domain"
    t.text "response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["domain"], name: "index_company_hunterios_on_domain"
  end

  create_table "entries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "position"
    t.string "company_name", null: false
    t.string "email"
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "lookup_state", default: "unknown", null: false
    t.uuid "company_id"
    t.string "email_format"
    t.integer "email_confidence", default: 0
    t.string "title"
    t.string "middle_name"
    t.string "domain"
    t.index ["company_id"], name: "index_entries_on_company_id"
    t.index ["email_format"], name: "index_entries_on_email_format"
    t.index ["lookup_state"], name: "index_entries_on_lookup_state"
  end

  create_table "entry_links", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "entry_id", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "list_entries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "list_id"
    t.uuid "entry_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lists", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "sort_by", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "gender", null: false
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", limit: 128
    t.string "confirmation_token", limit: 128
    t.string "remember_token", limit: 128
    t.string "language", default: "en", null: false
    t.index ["email"], name: "index_users_on_email"
    t.index ["language"], name: "index_users_on_language"
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  add_foreign_key "company_addresses", "companies"
  add_foreign_key "entries", "companies"
  add_foreign_key "entries", "users"
  add_foreign_key "entry_links", "entries"
  add_foreign_key "list_entries", "entries"
  add_foreign_key "list_entries", "lists"
  add_foreign_key "lists", "users"
end
