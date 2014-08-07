# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20140807200425) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "admin_users", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.integer  "role",            default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree

  create_table "claim_comments", force: true do |t|
    t.text     "body"
    t.uuid     "user_id"
    t.string   "user_type"
    t.uuid     "claim_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "claims", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.uuid     "user_id"
    t.uuid     "photo_id"
    t.integer  "status",     default: 0
    t.json     "details",    default: {}
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "number"
  end

  add_index "claims", ["number", "user_id"], name: "index_claims_on_number_and_user_id", unique: true, using: :btree

  create_table "diagnoses", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "diagnoses", ["name"], name: "index_diagnoses_on_name", unique: true, using: :btree

  create_table "hospitals", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hospitals", ["name"], name: "index_hospitals_on_name", unique: true, using: :btree

  create_table "photos", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.uuid     "user_id"
    t.string   "file"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "service_codes", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.text     "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "code"
    t.decimal  "fee",                 precision: 11, scale: 4
    t.date     "effective_date"
    t.date     "termination_date"
    t.boolean  "requires_specialist",                          default: false, null: false
  end

  add_index "service_codes", ["code"], name: "index_service_codes_on_code", using: :btree
  add_index "service_codes", ["name"], name: "index_service_codes_on_name", unique: true, using: :btree

  create_table "statutory_holidays", force: true do |t|
    t.date     "day"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "statutory_holidays", ["day"], name: "index_statutory_holidays_on_day", unique: true, using: :btree

  create_table "users", id: :uuid, default: "uuid_generate_v4()", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "authentication_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.uuid     "agent_id"
  end

  add_index "users", ["authentication_token"], name: "index_users_on_authentication_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

end
