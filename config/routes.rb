Rails.application.routes.draw do
  apipie

  scope module: 'v3' do
    root to: "home#show"
    resource :session, only: %i[new create destroy]
  end

  namespace :v1 do
    resource :user, only: %i[show create update]
    resources :agents, only: %i[index]
    resources :claims, only: %i[index show create update destroy]
    resources :diagnoses, only: %i[index]
    resources :hospitals, only: %i[index]
    resources :photos, only: %i[show create]
    resources :service_codes, only: %i[index show]
  end

  namespace :admin do
    resource :dashboard, only: %i[show]
    resources :admin_users, only: %i[index new create edit update destroy]
    resources :claims, only: %i[index edit update] do
      post :reclaim, on: :member
    end
    resources :edt_files, only: %i[index create show] do
      get 'download/:filename', action: 'download', on: :member, as: :download
    end
    resources :users, only: %i[index edit update destroy] do
      resources :submissions, only: %i[create]
    end
    root to: redirect("/admin/dashboard")
  end
end
