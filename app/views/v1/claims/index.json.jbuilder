json.claims do
  json.array! @claims, partial: "claim", as: :claim
end
