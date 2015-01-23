class UserForm
  include ActiveModel::Model
  include Virtus.model
  include ValidationScopes

  def self.model_params
    return [
            [:email, String],
            [:name, String],
            [:password, String],
            [:role, String],
            [:agent_id, String],
            [:pin, String],
            [:provider_number, Integer],
            [:group_number, String],
            [:office_code, String],
            [:specialty_code, Integer],
            [:default_template, String],
           ]
  end

  def self.all_params
    return model_params
  end

  def self.all_param_names
    ClaimForm.param_names(all_params)
  end

  all_params.each do |name, type|
    if type == :bool
      attribute name, Axiom::Types::Boolean
    else
      attribute name, type
    end
  end

  attr_reader :user

  validates :email, presence: true, email: true
  validates :agent_id, presence: true, if: -> { doctor? }
  validates :name, presence: true
  validates :pin, format: {with: /\A\d{4}?\Z/}
  validates :provider_number, numericality: {only_integer: true, greater_than_or_equal_to: 100, less_than_or_equal_to: 999999}, presence: true, if: -> { doctor? }
  validates :group_number, length: {maximum: 4, minimum: 4}, presence: true, if: -> { doctor? }
  validates :office_code, length: {maximum: 1, minimum: 1}, presence: true, if: -> { doctor? }
  validates :specialty_code, numericality: {only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 99}, presence: true, if: -> { doctor? }
  validates :role, presence: true, inclusion: {in: ["doctor", "agent"]}
  validate :existence

  def initialize(user, attributes = nil)
    if !user.is_a?(User)
      super(user)
    else
      @user = user
      attrs = user.attributes.slice(*UserForm.all_param_names.map(&:to_s))
      attrs['role'] = user.role
      attrs.merge!(attributes) if attributes
      super(attrs)
    end
  end

  def doctor?
    role == "doctor"
  end

  def perform
    return false if invalid?
    unless @user
      @user = User.build
    end
    @user.update!(user_attributes)
    true
  end

  def as_json(options = nil)
    attributes.slice(*UserForm.all_param_names).tap do |response|
      response.delete(:password)
      response[:id] = @user.id
      response[:role] = role
      valid?
      response[:errors] = errors.as_json
    end
  end

  private

  def user_attributes
    {
      role: role,
      name: name,
      email: email.to_s.downcase,
      password: password.to_s,
      agent_id: agent_id,
      default_template: default_template,
      pin: pin,
      provider_number: provider_number,
      group_number: group_number,
      office_code: office_code,
      specialty_code: specialty_code,
    }
  end

  def existence
    errors.add :email, :taken if User.where.not(id: user.id).where(email: email.to_s.downcase).exists?
  end

end
