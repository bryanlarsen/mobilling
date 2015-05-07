class V1::PatientsController < V1::BaseController
  def index
    scope = policy_scope(Claim)
    if params[:name]
      scope = scope.where(["details->>'patient_name' ILIKE ?", "%#{params[:name]}%"])
    end
    if params[:number]
      scope = scope.where(["details->>'patient_number' ILIKE ?", "#{params[:number]}%"])
    end
    patients = scope.select("DISTINCT ON (details->>'patient_number', details->>'patient_name') (details->>'patient_number') AS health_number, (details->>'patient_name') AS name, (details->>'patient_province') AS province, (details->>'patient_birthday') AS birthday, (details->>'patient_sex') AS sex").limit(10).map do |claim|
      {
        name: claim.name,
        number: claim.health_number,
        province: claim.province,
        birthday: claim.birthday,
        sex: claim.sex
      }
    end

    render json: patients
  end
end
