Rails.application.routes.draw do
  apipie

  root to: "home#show"

  namespace :v1 do
    resource :session, only: %i[create]
    resource :user, only: %i[show create]
    resources :claims, only: %i[index show update]
    resources :photos, only: %i[create]
  end
end
