namespace :db do
  namespace :import do
    task :medicalbilling => :environment do
      Holidays.load_all

      class MedicalBilling < ActiveRecord::Base
        self.abstract_class = true
        establish_connection "medicalbilling"
      end

      class OldUser < MedicalBilling
        self.table_name = "users"
        belongs_to :agent, class_name: "OldUser"
        # string   "email"
        # string   "password_digest"
        # string   "name"
        # string   "billing_number"
        # datetime "created_at"
        # datetime "updated_at"
        # string   "role"
        # string   "stripe_customer_id"
        # string   "plan", default: "trial"
        # integer  "agent_id"
        # string   "specialties", array: true
      end

      class OldClaim < MedicalBilling
        self.table_name = "claims"
        self.inheritance_column = nil
        belongs_to :user, class_name: "OldUser"
        has_many :comments, class_name: "OldComment", foreign_key: "claim_id"
        has_many :details, class_name: "OldDetail", foreign_key: "claim_id"
        # integer  "user_id"
        # string   "state" # saved, unprocessed, processed, rejected_admin_attention, rejected_doctor_attention, paid
        # integer  "backend_number"
        # string   "patient_name"
        # datetime "created_at"
        # datetime "updated_at"
        # string   "hospital"
        # string   "referring_physician"
        # string   "diagnosis"
        # date     "admission_date"
        # string   "patient_id_photo"
        # date     "first_seen_date"
        # date     "last_seen_date"
        # date     "submitted_date"
        # decimal  "value"
        # boolean  "is_last_seen_date_discharge"
        # boolean  "customized_details"
        # boolean  "autogeneration_enabled"
        # decimal  "charge"
        # string   "stripe_charge_id"
        # string   "type"
        # date     "procedure_date"
        # string   "initial_consult_location" # er ward
        # string   "initial_consult_type" # general comprehensive limited repeat
        # string   "initial_consult_time" # weekday weekday_office_hours weekday_evening weekend_holiday night
        # boolean  "initial_consult_travel"
      end

      class OldDetail < MedicalBilling
        self.table_name = "details"
        belongs_to :claim, class_name: "OldClaim"
        # integer  "claim_id"
        # date     "day"
        # string   "code"
        # datetime "created_at"
        # datetime "updated_at"
        # datetime "time_in"
        # datetime "time_out"
      end

      class OldComment < MedicalBilling
        self.table_name = "comments"
        belongs_to :claim, class_name: "OldClaim"
        belongs_to :user, class_name: "OldUser"
        # integer  "claim_id"
        # text     "body"
        # datetime "created_at"
        # datetime "updated_at"
        # integer  "user_id"
      end

      # Admins + Agents
      OldUser.where(role: %w[admin agent]).find_each do |old_admin_user|
        # puts "importing #{old_admin_user.role} #{old_admin_user.email}"
        new_admin_user = Admin::User.find_or_initialize_by(email: old_admin_user.email)
        new_admin_user.attributes = old_admin_user.attributes.slice(*%w[name email password_digest role])
        new_admin_user.save!
      end

      # Doctors
      OldUser.where(role: "doctor").find_each do |old_user|
        # puts "importing doctor #{old_user.email}"
        new_user = User.find_or_initialize_by(email: old_user.email)
        new_user.attributes = old_user.attributes.slice(*%w[name password_digest created_at])
        new_user.specialties = old_user.specialties.select { |specialty| User::SPECIALTIES.include?(specialty) }
        if old_user.agent.present?
          new_user.agent = Admin::User.find_by(email: old_user.agent.email)
        end
        new_user.save!
      end

      OldClaim.find_each do |old_claim|
        user = User.find_by(email: old_claim.user.email)
        if user.nil?
          puts "skipping claim ##{old_claim.id} created by #{old_claim.user.role}: #{old_claim.user.email}"
          next
        end

        specialty = old_claim.type.underscore[6..-1]

        unless User::SPECIALTIES.include?(specialty)
          puts "skipping claim ##{old_claim.id} due to unsupported specialty: #{specialty}"
          next
        end

        # puts "importing claim #{old_claim.id} by #{user.email}"
        new_claim = user.claims.find_or_initialize_by(number: old_claim.id)
        new_claim.status = old_claim.state
        new_claim.created_at = old_claim.created_at

        # consult_type

        if old_claim.initial_consult_type.present? and old_claim.initial_consult_location.present?
          old_consult_type = old_claim.initial_consult_type
          old_consult_location = "er" if old_claim.initial_consult_location == "er"
          old_consult_location = "non_er" if old_claim.initial_consult_location == "ward"

          consult_type = [old_consult_type, old_consult_location].compact.join("_")
          consult_type = nil if consult_type.blank?

          unless Claim::CONSULT_TYPES.include?(consult_type)
            puts "skipping claim ##{old_claim.id} due to unsupported consult type and location: #{old_claim.initial_consult_type}, #{old_claim.initial_consult_location}"
            next
          end
        end

        # consult_premium_visit

        if old_claim.first_seen_date.present? and old_claim.initial_consult_time.present?
          consult_premium_visit = "weekday"

          if old_claim.first_seen_date.wday == 0 or old_claim.first_seen_date.wday == 6
            consult_premium_visit = "weekend"
          end

          respected_holidays = ["Good Friday", "Boxing Day", "Canada Day",
                                "Christmas Day", "Civic Holiday", "Labour Day",
                                "New Year's Day", "Thanksgiving", "Victoria Day"]

          holidays = Holidays.on(old_claim.first_seen_date, :ca_on).map { |holiday| holiday[:name] }

          if (respected_holidays & holidays).present?
            consult_premium_visit = "holiday"
          end

          case old_claim.initial_consult_time
          when "weekday"
            consult_premium_visit += "_day"
          when "weekday_office_hours"
            consult_premium_visit += "_office_hours"
          when "weekday_evening"
            consult_premium_visit += "_evening"
          when "weekend_holiday"
            consult_premium_visit += "_day"
          when "night"
            consult_premium_visit += "_night"
          end

          consult_premium_visit = "weekend_day" if consult_premium_visit == "weekend_evening"

          unless Claim::CONSULT_PREMIUM_VISITS.include?(consult_premium_visit)
            puts "skipping claim ##{old_claim.id} due to unsupported consult time: #{old_claim.initial_consult_time}"
            next
          end
        end

        # consult premium first

        if consult_premium_visit.present? and old_claim.first_seen_date.present?
          consult_premium_first = !user.claims
            .where.not(id: new_claim.id)
            .where("details->>'first_seen_on' = ?", old_claim.first_seen_date)
            .where("details->>'consult_premium_visit' = ?", consult_premium_visit)
            .where("details->>'consult_premium_first' = ?", "true")
            .exists?
        end

        # details

        daily_details = old_claim.details.map do |daily_detail|
          time_in = daily_detail.time_in.strftime("%H:%M") if daily_detail.time_in.present?
          time_out = daily_detail.time_out.strftime("%H:%M") if daily_detail.time_out.present?

          cardiology_codes = %w[A605A A600A A675A A606A C605A C600A C675A C606A C122A E083A C123A C602A C607A C609A C124A]
          family_medicine_codes = %w[C933A E082A C122A E083A C123A C002A C007A C009A C124A]
          internal_medicine_codes = %w[A135A A130A A435A A136A C135A C130A C435A C136A C122A E083A C123A C132A C137A C139A C124A]

          autogenerated_codes = (cardiology_codes + family_medicine_codes + internal_medicine_codes).uniq
          autogenerated = autogenerated_codes.include?(daily_detail.code)

          {
            "day" => daily_detail.day,
            "code" => daily_detail.code,
            "time_in" => time_in,
            "time_out" => time_out,
            "autogenerated" => autogenerated
          }
        end

        daily_details.sort_by! { |daily_detail| daily_detail["day"] }

        new_claim.details = {
          "specialty" => specialty,
          "patient_name" => old_claim.patient_name,
          "hospital" => old_claim.hospital,
          "referring_physician" => old_claim.referring_physician,
          "diagnoses" => [{name: old_claim.diagnosis}],
          "most_responsible_physician" => nil, # TODO
          "admission_on" => old_claim.admission_date,
          "first_seen_on" => old_claim.first_seen_date,
          "first_seen_consult" => nil, # TODO
          "last_seen_on" => old_claim.last_seen_date,
          "last_seen_discharge" => old_claim.is_last_seen_date_discharge,
          "icu_transfer" => nil, # TODO
          "procedure_on" => old_claim.procedure_date,
          "consult_type" => consult_type,
          "consult_time_in" => nil,
          "consult_time_out" => nil,
          "consult_premium_visit" => consult_premium_visit,
          "consult_premium_first" => consult_premium_first,
          "consult_premium_travel" => old_claim.initial_consult_travel, # TODO
          "daily_details" => daily_details
        }

        new_claim.save!

        # comments

        old_claim.comments.find_each do |old_comment|
          new_user = User.find_by(email: old_comment.user.email) || Admin::User.find_by(email: old_comment.user.email)
          new_comment = new_claim.comments.find_or_initialize_by(created_at: old_comment.created_at)
          new_comment.body = old_comment.body
          new_comment.user = new_user
          new_comment.save!
        end
      end
    end
  end
end
