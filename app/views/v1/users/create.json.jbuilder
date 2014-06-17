json.users do
  json.partial! "user", user: @interactor.user
end
