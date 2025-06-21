class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include DeviseHackFakeSession # セッションエラー回避用
end
