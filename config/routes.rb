require 'sidekiq/web'

Rails.application.routes.draw do
  root 'page#index'

  namespace :api do
    namespace :v1 do
      # user and auth
      post 'confirm', to: 'clearance/confirmations#create'
      patch 'confirm', to: 'clearance/confirmations#update'
      resources :passwords, controller: 'clearance/passwords', only: [:create]
      patch :passwords, to: 'clearance/passwords#update'
      resource :session, controller: 'clearance/sessions', only: [:create]
      resources :users, controller: 'clearance/users', only: [:create, :index]
      patch :users, to: 'clearance/users#update'
      delete '/sign_out', to: 'clearance/sessions#destroy'

      resources :lists, only: [:index, :show, :create, :destroy, :update] do
        member do
          get :export
          post :reassign
        end
      end
      resources :entries, only: [:create, :update, :destroy, :show] do
        collection do
          get :latest
          post :retrieve
        end

        member do
          get :lists
        end
      end
    end
  end

  if Rails.env.production?
    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      username == 'sidekiq' && password == 'le4dfinder$$$'
    end
  end
  mount Sidekiq::Web, at: '/sidekiq'

  get '*path', to: 'page#index'
end
