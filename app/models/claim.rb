class Claim < ActiveRecord::Base
  enum status: %i[saved unprocessed processed rejected_admin_attention rejected_doctor_attention paid]

  belongs_to :user
  belongs_to :photo
end
