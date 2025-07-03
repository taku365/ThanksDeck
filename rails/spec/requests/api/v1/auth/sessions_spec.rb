require "rails_helper"

RSpec.describe "Api::V1::Auth::Sessions", type: :request do
  let(:url)         { "/api/v1/auth/guest_sign_in" }
  let(:guest_email) { "guest@example.com" }

  describe "POST /api/v1/auth/guest_sign_in" do
    context "ゲストユーザーが存在しない場合" do
      it "新しいゲストユーザーを作成し、HTTPステータス200を返す" do
        expect {
          post url
        }.to change { User.count }.by(1)

        user = User.find_by(email: guest_email)
        expect(user).to be_present
        expect(user.name).to eq("ゲストユーザー")
        expect(user).to be_confirmed if user.respond_to?(:confirmed_at)
      end

      it "レスポンスボディにユーザー情報を返す" do
        post url
        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)
        data = json["data"]

        expect(data).to include(
          "id" => a_kind_of(Integer),
          "provider" => "email",
          "uid" => guest_email,
          "name" => "ゲストユーザー",
          "email" => guest_email,
        )
      end

      it "認証用ヘッダーを返す" do
        post url

        expect(response.headers["access-token"]).to be_present
        expect(response.headers["client"]).to be_present
        expect(response.headers["uid"]).to eq(guest_email)
        expect(response.headers["expiry"]).to be_present
      end
    end

    context "ゲストユーザーが既に存在する場合" do
      before do
        User.create!(
          email: guest_email,
          password: SecureRandom.urlsafe_base64,
          name: "旧ゲスト",
          confirmed_at: Time.current,
        )
      end

      it "ユーザーを新規作成せず、件数が変わらない" do
        expect {
          post url
        }.not_to change { User.count }
      end

      it "既存のユーザー情報を返す" do
        post url
        json = JSON.parse(response.body)
        expect(json["data"]["email"]).to eq(guest_email)
      end
    end
  end
end
