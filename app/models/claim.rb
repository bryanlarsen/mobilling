class Claim < ActiveRecord::Base
  CONSULT_TYPES = %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er]
  CONSULT_PREMIUM_VISITS = %w[office_hours day evening night holiday]

  enum status: %i[saved unprocessed processed rejected_admin_attention rejected_doctor_attention paid]

  scope :submitted, -> { where(status: statuses.except("saved").values) }

  belongs_to :user
  belongs_to :photo
end
