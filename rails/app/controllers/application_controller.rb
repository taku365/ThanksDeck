class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession # セッションエラー回避用

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

    # サインアップ時にnameカラムを追加する
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end
end
