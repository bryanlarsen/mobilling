json.id           claim.id
json.status       claim.status
json.patient_name claim.details[:patient_name]
json.hospital     claim.details[:hospital]
json.created_at   claim.created_at
json.updated_at   claim.updated_at
