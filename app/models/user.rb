class User < ActiveRecord::Base
  SPECIALTIES = %w[internal_medicine family_medicine cardiology anesthesiologist surgical_assist] #psychotherapist

  enum role: %i[doctor agent admin ministry]

  has_secure_password
  has_many :claims, dependent: :destroy, inverse_of: :user
  has_many :photos, dependent: :destroy, inverse_of: :user
  belongs_to :agent, class_name: "User", inverse_of: :doctors
  has_many :doctors, class_name: "User", foreign_key: "agent_id", inverse_of: :agent
  has_many :comments, class_name: "Claim::Comment", inverse_of: :user, dependent: :destroy

  def self.model_params
    return [
            [:email, String],
            [:name, String],
            [:password, String],
            [:password_confirmation, String],
            [:current_password, String],
            [:role, String],
            [:agent_id, String],
            [:pin, String],
            [:provider_number, Integer],
            [:group_number, String],
            [:office_code, String],
            [:specialty_code, Integer],
            [:default_specialty, String],
           ]
  end

  def self.all_params
    return model_params
  end

  def self.all_param_names
    ClaimForm.param_names(all_params)
  end

  attr_accessor :current_password

  before_validation do
    self.email = email.downcase
  end

  before_save do
    unless doctor?
      self.agent = self
    end
  end

  validates :email, presence: true, email: true
  validates :agent_id, presence: true, if: -> { doctor? }
  validates :agent, presence: true, if: -> { doctor? }
  validates :name, presence: true
  validates :pin, format: {with: /\A\d{4}?\Z/}
  validates :provider_number, numericality: {only_integer: true, greater_than_or_equal_to: 100, less_than_or_equal_to: 999999}, presence: true, if: -> { doctor? }
  validates :group_number, length: {maximum: 4, minimum: 4}, presence: true, if: -> { doctor? }
  validates :office_code, length: {maximum: 1, minimum: 1}, presence: true, if: -> { doctor? }
  validates :specialty_code, numericality: {only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 99}, presence: true, if: -> { doctor? }
  validates :role, presence: true, inclusion: {in: ["doctor", "agent"]}, if: -> { role_changed? }
  validate :existence
  validate :check_current_password, if: -> { password_digest_changed? }

  def doctor?
    role == "doctor"
  end

  def as_json(options = nil)
    attributes.slice(*User.all_param_names.map(&:to_s)).tap do |response|
      response.delete(:password)
      response[:id] = id
      response[:role] = role
      if options && options[:include_warnings]
        valid?
        response[:errors] = errors.as_json
      end
      if options && options[:include_doctors]
        response[:doctors] = {}
        UserPolicy::Scope.new(self, User).resolve.each do |doctor|
          response[:doctors][doctor.id] = doctor.name
        end
      end
    end
  end

  private

  def existence
    errors.add :email, :taken if User.where.not(id: id).where(email: email).exists?
  end

  def check_current_password
    return if new_record?
    errors.add :current_password, "is invalid" unless User.find(id).authenticate(current_password)
  end

end
