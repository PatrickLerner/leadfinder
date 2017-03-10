Rails.application.routes.draw do
  devise_for :users
  root 'page_controller#index'

  get '*path', to: 'page_controller#index'
end
