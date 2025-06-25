class Api::V1::User::ConfirmationsController < Api::V1::BaseController
  def update
    user = User.find_by(confirmation_token: params[:confirmation_token])
    return render json: { message: "ユーザーが見つかりません" }, status: :not_found if user.nil?
    return render json: { message: "ユーザーは既に確認されています。" }, status: :bad_request if user.confirmed?

    user.update!(confirmed_at: Time.current)

    render json: { message: "ユーザーの確認が完了しました。" }, status: :ok
  end

  def create
    user = User.find_by(email: params[:email])
    if user && !user.confirmed?
      user.send_confirmation_instructions
      render json: { message: "確認メールを再送信しました" }, status: :ok
    else
      render json: { message: "再送信できませんでした" }, status: :bad_request
    end
  end
end
