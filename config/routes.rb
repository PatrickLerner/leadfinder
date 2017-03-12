Rails.application.routes.draw do
  root 'page#index'

  namespace :api do
    namespace :v1 do
      # user and auth
      resources :passwords, controller: 'clearance/passwords', only: [:create]
      patch :passwords, to: 'clearance/passwords#update'
      resource :session, controller: 'clearance/sessions', only: [:create]
      resources :users, controller: 'clearance/users', only: [:create, :index]
      delete '/sign_out', to: 'clearance/sessions#destroy', as: "sign_out"

      resources :lists, only: [:index, :show, :create, :destroy, :update]
    end
  end

  get '*path', to: 'page#index'
end
