require 'sidekiq/web'

Rails.application.routes.draw do
  root 'page#index'

  namespace :api do
    namespace :v1 do
      # user and auth
      resources :passwords, controller: 'clearance/passwords', only: [:create]
      patch :passwords, to: 'clearance/passwords#update'
      resource :session, controller: 'clearance/sessions', only: [:create]
      resources :users, controller: 'clearance/users', only: [:create, :index]
      patch :users, to: 'clearance/users#update'
      delete '/sign_out', to: 'clearance/sessions#destroy'

      resources :lists, only: [:index, :show, :create, :destroy, :update] do
        collection do
          get :inbox
        end
        member do
          get :export
        end
      end
      resources :entries, only: [:create, :destroy] do
        member do
          get :lists
          patch :lists, to: 'entries#update_lists'
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
