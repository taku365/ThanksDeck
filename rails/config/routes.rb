Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development? # letter_opener_web 用
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      mount_devise_token_auth_for "User", at: "auth"
    end
  end
end
