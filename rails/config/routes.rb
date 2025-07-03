Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development? # letter_opener_web 用
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"

      # DeviseTokenAuth の標準認証ルート一式を /api/v1/auth にマウント
      mount_devise_token_auth_for "User", at: "auth", controllers: {
        sessions: "api/v1/auth/sessions",
      }

      # Devise の User 認証スコープとして追加
      devise_scope :user do
        post "auth/guest_sign_in", to: "auth/sessions#guest_sign_in"
      end

      # 認証中ユーザー向けのメール確認
      namespace :user do
        resource :confirmations, only: [:update, :create]
      end

      # 現在ログイン中のユーザー情報取得
      namespace :current do
        resource :user, only: [:show]
      end

      # Cards リソースの CRUD ルートを定義
      resources :cards, only: [:index, :show, :create, :update, :destroy] do
        get :today, on: :collection

        get "deck/:year/:month", to: "cards#deck", on: :collection
      end
    end
  end
end
