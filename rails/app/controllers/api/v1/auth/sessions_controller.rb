module Api
  module V1
    module Auth
      class SessionsController < DeviseTokenAuth::SessionsController
        skip_before_action :assert_is_devise_resource!, only: [:guest_sign_in]
        skip_before_action :configure_permitted_parameters, only: [:guest_sign_in]

        # POST /api/v1/auth/guest_sign_in
        def guest_sign_in
          # ゲストユーザーの取得／作成
          guest = ::User.find_or_create_by!(email: "guest@example.com") do |user|
            user.password = SecureRandom.urlsafe_base64
            user.name     = "ゲストユーザー"
            user.skip_confirmation! if user.respond_to?(:skip_confirmation!)
          end

          # DeviseTokenAuth 用に @resource をセット
          @resource = guest

          # トークン発行 → TokenFactory::Token 構造体を受け取る
          token_struct = @resource.create_token

          client_id = token_struct.client
          token     = token_struct.token

          # DB 保存
          @resource.save!

          # レスポンスヘッダーにトークン情報をマージ
          response.headers.merge! @resource.build_auth_headers(token, client_id)

          # レスポンスボディ（必要なデータだけを返す）
          render json: {
            data: @resource.as_json(only: %i[id provider uid name email]),
          }
        end
      end
    end
  end
end
