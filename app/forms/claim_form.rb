class ClaimForm
  include ActiveModel::Model
  include Virtus.model
  include ValidationScopes

  def self.model_params
    return [
            [:photo_id, String],
            [:status, String],
            [:user_id, String]
           ]
  end

  def self.details_params
    return [
            [:specialty, String],
            [:patient_name, String],
            [:hospital, String],
            [:referring_physician, String],
            [:most_responsible_physician, :bool],
            [:admission_on, String],
            [:first_seen_on, String],
            [:first_seen_consult, :bool],
            [:last_seen_on, String],
            [:last_seen_discharge, :bool],
            [:icu_transfer, :bool],
            [:consult_type, String],
            [:consult_time_in, String],
            [:consult_time_out, String],
            [:consult_premium_visit, String],
            [:consult_premium_first, :bool],
            [:consult_premium_travel, :bool],
            [:patient_number, String],
            [:patient_province, String],
            [:patient_birthday, String],
            [:patient_sex, String],
            [:referring_laboratory, String],
            [:payment_program, String],
            [:payee, String],
            [:manual_review_indicator, :bool],
            [:service_location, String],
            [:last_code_generation, String],
           ]
  end

  def self.helper_params
    return [
            [:comment, String],           # new comment
            [:num_comments, Integer],     # number of comments when editing started
            [:consult_time_type, String], # if set, can return premium counts
            [:unread_comments, Integer],  # number of unread comments for this user.   Set to 0 to set read flags
           ]
  end

  def self.scalar_params
    return model_params + details_params + helper_params
  end

  def self.array_params
    return [
            [:diagnoses, Array, [[:name, String]]],
            [:daily_details, Array, DailyDetailForm.all_params],
           ]
  end

  def self.all_params
    return scalar_params + array_params
  end

  def self.param_names(list)
    return list.map do |name, type, array|
      if type == Array
        { name => param_names(array) }
      else
        name
      end
    end
  end

  def self.all_param_names
    param_names(all_params)
  end

  all_params.each do |name, type|
    if type == :bool
      attribute name, Axiom::Types::Boolean
    else
      attribute name, type
    end
  end
  attribute :user, User

end
