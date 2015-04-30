class V1::PatientsController < V1::BaseController
  def index
    scope = policy_scope(Claim)
    if params[:name]
      scope = scope.where(["details->>'patient_name' ILIKE ?", "%#{params[:name]}%"])
    end
    if params[:number]
      scope = scope.where(["details->>'patient_number' ILIKE ?", "%#{params[:number]}%"])
    end
    patients = scope.limit(10).map do |claim|
      {
        name: claim.details['patient_name'],
        number: claim.details['patient_number'],
        province: claim.details['patient_province'],
        birthday: claim.details['patient_birthday'],
        sex: claim.details['patient_sex']
      }
    end

    render json: patients
  end
end
