Rails.application.routes.draw do
  apipie

  root to: "home#show"

  namespace :v1 do
    resource :session, only: %i[create]
    resource :user, only: %i[show create update]
    resources :claims, only: %i[index show update destroy]
    resources :photos, only: %i[show create]
  end

  namespace :admin do
    resource :dashboard, only: %i[show]
    resource :session, only: %i[new create destroy]
    resources :claims, only: %i[index edit update]
    resources :users, only: %i[index new create edit update destroy]
  end
end
