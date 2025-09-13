require "rails_helper"

RSpec.describe "Api::V1::User::Confirmations", type: :request do
  def json
    JSON.parse(response.body)
  end

  describe "PATCH /api/v1/user/confirmations" do
    let(:user) { create(:user, confirmed_at: nil) }
    let(:token) do
      # Deviseのバージョン次第で raw を @raw_confirmation_token に保持
      user.confirmation_token || user.instance_variable_get(:@raw_confirmation_token)
    end

    before do
      # Deviseがconfirmation_tokenを生成
      user.send_confirmation_instructions
    end

    it "有効トークンなら 200 & next: signin" do
      patch "/api/v1/user/confirmations",
            params: { confirmation_token: token },
            as: :json

      expect(response).to have_http_status(:ok)
      expect(json["status"]).to eq("success")
      expect(json["next"]).to eq("signin")
      expect(user.reload).to be_confirmed
    end

    it "無効トークンなら 422 & next: resend" do
      patch "/api/v1/user/confirmations",
            params: { confirmation_token: "bogus" },
            as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json["status"]).to eq("error")
      expect(json["next"]).to eq("resend")
      expect(json["message"]).to be_present
    end
  end

  describe "POST /api/v1/user/confirmations（再送）" do
    let(:unconfirmed) { create(:user, confirmed_at: nil) }
    let(:confirmed)   { create(:user, confirmed_at: Time.current) }

    it "未確認ユーザーなら 200 & 再送成功" do
      post "/api/v1/user/confirmations",
           params: { email: unconfirmed.email },
           as: :json

      expect(response).to have_http_status(:ok)
      expect(json["status"]).to eq("success")
      expect(json["next"]).to eq("none").or eq("signin") # 実装に合わせて
      expect(json["message"]).to be_present
    end

    it "確認済みユーザーなら 200 & next: signin" do
      post "/api/v1/user/confirmations",
           params: { email: confirmed.email },
           as: :json

      expect(response).to have_http_status(:ok)
      expect(json["status"]).to eq("success")
      expect(json["next"]).to eq("signin")
    end

    it "存在しないメールなら 422 & next: resend" do
      post "/api/v1/user/confirmations",
           params: { email: "none@example.com" },
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json["status"]).to eq("error")
      expect(json["next"]).to eq("resend")
    end
  end
end
