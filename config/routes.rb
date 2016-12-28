Rails.application.routes.draw do
  root to: "pages#index"

  resources :pages, except: [:new, :create, :edit, :update, :destroy, :index, :show] do
  	collection{
  		get :blogs
  		get :events
  		get :pictures
  		get :videos
  	}
  end
end
