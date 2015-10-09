Rails.application.routes.draw do
  apipie

  scope module: 'v3' do
    root to: "home#show"
    get "/login", to: "home#login"
    get "/create_account", to: "home#login"
    get "/forgot_password", to: "home#login"
    resource :session, only: %i[new create destroy show]
    resource :create_password, only: %i[new]
  end

  namespace :v1 do
    resources :users, only: %i[index show create update]
    resources :agents, only: %i[index]
    resources :claims, only: %i[index show create update destroy] do
      resources :items, only: %i[create update]
      get :read_comments
    end
    resources :diagnoses, only: %i[index]
    resources :hospitals, only: %i[index]
    resources :photos, only: %i[show create]
    resources :service_codes, only: %i[index show]
    resources :patients, only: %i[index]
    resource :request_password_reset, only: %i[create]
  end

  namespace :admin do
    resource :dashboard, only: %i[show]
    resources :claims, only: %i[index edit] do
      collection do
        get :print
      end
      post :reclaim, on: :member
    end
    resources :edt_files, only: %i[index create show] do
      get 'download/:filename', action: 'download', on: :member, as: :download
    end
    resources :users, only: %i[new index edit destroy] do
      resources :submissions, only: %i[create]
    end
    resources :submissions, only: %i[update]
    root to: redirect("/admin/dashboard")
  end

  scope module: 'v3' do
    get '*unmatched', to: "home#show"   # probably a react route
  end
end
