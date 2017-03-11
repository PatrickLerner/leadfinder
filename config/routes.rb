Rails.application.routes.draw do
  root 'page#index'

  namespace :api do
    namespace :v1 do

      resources :passwords, controller: "clearance/passwords", only: [:create]
      resource :session, controller: "clearance/sessions", only: [:create]

      resources :users, controller: "clearance/users", only: [:create, :index] do
        resource :password,
          controller: "clearance/passwords",
          only: [:create, :update]
      end

      delete "/sign_out" => "clearance/sessions#destroy", as: "sign_out"
    end
  end

  get '*path', to: 'page#index'
end
