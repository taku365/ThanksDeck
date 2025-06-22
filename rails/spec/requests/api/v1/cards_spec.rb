require "rails_helper"

RSpec.describe "Api::V1::Cards", type: :request do
  let(:user)   { create(:user, confirmed_at: Time.current) }
  let!(:cards) { create_list(:card, 3, user: user) } # テスト前に必ず実行 作成した3件分のレコードオブジェクトを要素に持つ配列

  describe "GET /api/v1/cards" do
    context "認証あり" do
      let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

      it "200 が返り、カードの配列を返す" do
        get "/api/v1/cards", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body) # JSONをハッシュに変換(本来は自動)
        expect(json.size).to eq 3
        expect(json.first).to include("id", "content", "logged_date")
      end
    end

    context "認証なし" do
      it "401 Unauthorized が返る" do
        get "/api/v1/cards"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/cards/:id" do
    let(:card) { cards.first }

    context "認証あり" do
      let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

      it "200 が返り、カードオブジェクトを返す" do
        get "/api/v1/cards/#{card.id}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json).to include(
          "id" => card.id,
          "content" => card.content,
          "logged_date" => card.logged_date.to_s, # 日付オブジェクトを文字列に変換
        )
      end
    end

    context "認証なし" do
      it "401 Unauthorized が返る" do
        get "/api/v1/cards/#{card.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
