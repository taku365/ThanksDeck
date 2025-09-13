class Api::V1::User::ConfirmationsController < Api::V1::BaseController
  # PATCH /api/v1/user/confirmations
  def update
    token = params[:confirmation_token].to_s

    resource = User.confirm_by_token(token)
    errs = resource.errors.details[:confirmation_token].to_a.map {|h| h[:error] }

    # 成功 or 既に確認済み → 200 + next: "signin"
    if errs.empty? || errs.include?(:already_confirmed)
      return render json: { status: "success", next: "signin", message: "アカウントの有効化が完了しています。ログインしてください。" }, status: :ok
    end

    # それ以外（無効/期限切れ/ユーザー不在等）は全部「再送」に寄せる → 422
    render json: { status: "error", next: "resend", message: "確認リンクが無効または期限切れです。メールを再送してください." }, status: :unprocessable_entity
  end

  # POST /api/v1/user/confirmations （再送）
  def create
    user = User.find_by(email: params[:email].to_s)

    # ユーザーが既に確認済みなら、再送は不要 → サインインを促す
    if user&.confirmed?
      return render json: { status: "success", next: "signin", message: "既に有効化済みです。ログインしてください。" }, status: :ok
    end

    # ユーザーは存在するが未確認の場合 → 確認メールを再送
    if user
      user.send_confirmation_instructions
      return render json: { status: "success", next: "none", message: "確認メールを再送信しました。" }, status: :ok
    end
    # ユーザー自体が見つからない場合 → 入力エラーとして扱う
    render json: { status: "error", next: "resend", message: "メールアドレスを確認してください。" }, status: :unprocessable_entity
  end
end
