Rails.application.routes.draw do
  apipie

  root to: "home#show"

  namespace :v1 do
    resource :session, only: %i[create]
    resource :user, only: %i[show create update]
    resources :agents, only: %i[index]
    resources :claims, only: %i[index show update destroy]
    resources :diagnoses, only: %i[index]
    resources :hospitals, only: %i[index]
    resources :photos, only: %i[show create]
    resources :service_codes, only: %i[index]
  end

  namespace :admin do
    resource :dashboard, only: %i[show]
    resource :session, only: %i[new create destroy]
    resources :admin_users, only: %i[index new create edit update destroy]
    resources :claims, only: %i[index edit update]
    resources :users, only: %i[index edit update destroy]
    root to: redirect("/admin/dashboard")
  end
end
