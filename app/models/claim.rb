class Claim < ActiveRecord::Base
  CONSULT_TYPES = %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er special_er special_non_er on_call_admission_er on_call_admission_non_er]
  CONSULT_PREMIUM_VISITS = %w[weekday_office_hours weekday_day weekday_evening weekday_night weekend_day weekend_night holiday_day holiday_night]

  enum status: %i[saved unprocessed processed rejected_admin_attention rejected_doctor_attention paid]

  scope :submitted, -> { where(status: statuses.except("saved").values) }

  belongs_to :user
  belongs_to :photo
  has_many :comments

  def as_json(options = nil)
    response = details.merge({id: id,
                               status: status,
                               photo_id: photo_id,
                               number: number,
                               created_at: created_at,
                               updated_at: updated_at,
                             })
    if options && options[:include_comments]
      response[:comments] = comments.map do |comment|
        {
          body: comment.body,
          user_name: comment.user.try(:name),
          created_at: comment.created_at,
        }
      end
# if we're going to do this, we should use a counter cache.  Some
# doctors have thousands of claims, so we have to watch out for n+1
#    else
#      response[:comments_count] = comments.size
    end
    response
  end
end
