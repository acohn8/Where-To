Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :places
      resources :reviews
      resources :users
    end
  end
end
