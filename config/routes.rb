Rails.application.routes.draw do
  root 'page_controller#index'

  get '*path', to: 'page_controller#index'
end
