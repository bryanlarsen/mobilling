Rails.application.routes.draw do
  apipie

  root to: "home#show"
  resource :password, only: %i[new]

  namespace :v1 do
    resource :session, only: %i[create destroy]
    resource :user, only: %i[show create update]
    resources :agents, only: %i[index]
    resources :claims, only: %i[index show create update destroy]
    resources :diagnoses, only: %i[index]
    resources :hospitals, only: %i[index]
    resources :password_resets, only: %i[create]
    resources :photos, only: %i[show create]
    resources :service_codes, only: %i[index show]
  end

  namespace :admin do
    resource :dashboard, only: %i[show]
    resource :session, only: %i[new create destroy]
    resources :admin_users, only: %i[index new create edit update destroy]
    resources :claims, only: %i[index edit update]
    resources :users, only: %i[index edit update destroy] do
      resources :submissions, only: %i[index create show] do
        get ':filename', action: 'show', on: :member
      end
      resources :edt_files, only: %i[create]
    end
    root to: redirect("/admin/dashboard")
  end
end
