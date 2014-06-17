Rails.application.routes.draw do
  apipie

  root to: "home#show"

  namespace :v1 do
    resource :session, only: %i[create]
  end
end
