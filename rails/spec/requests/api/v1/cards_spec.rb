require "rails_helper"

RSpec.describe "Api::V1::Cards", type: :request do
  let(:user)   { create(:user, confirmed_at: Time.current) }
  # 昨日のカードを３件作成(createテストで新規作成ができなくなってしまうため)
  let!(:cards) { create_list(:card, 3, user: user, logged_date: Date.yesterday) }

  # index
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

  # today
  describe "GET /api/v1/cards/today" do
    let!(:today_card) { create(:card, user: user, logged_date: Date.current) }

    context "認証あり" do
      let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

      it "200 が返り、今日の日付のカードだけが返ってくる" do
        get "/api/v1/cards/today", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.size).to eq 1
        expect(json.first["id"]).to eq today_card.id
        expect(json.first["content"]).to eq today_card.content
        expect(json.first["logged_date"]).to eq today_card.logged_date.to_s
      end
    end

    context "認証なし" do
      it "402 Unauthorized が返る" do
        get "/api/v1/cards/today"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  # deck
  describe "GET /api/v1/cards/deck/:year/:month" do
    before do
      Card.delete_all
      this_month_card_a; this_month_card_b; last_month_card
    end

    # 今月のカードを 2 件作成
    let(:this_month_card_a) { create(:card, user: user, logged_date: Date.current.beginning_of_month + 5.days) }
    let(:this_month_card_b) { create(:card, user: user, logged_date: Date.current.beginning_of_month + 10.days) }
    # 今月以外のカードを 1 件作成（フィルタ対象外）
    let(:last_month_card) { create(:card, user: user, logged_date: (Date.current - 1.month).beginning_of_month + 3.days) }

    let(:year)  { Date.current.year.to_s }
    let(:month) { Date.current.month.to_s }

    context "認証あり" do
      let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

      it "200 が返り、指定月のカードだけが返ってくる" do
        get "/api/v1/cards/deck/#{year}/#{month}", headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)

        # フィルタ対象外の last_month_card は含まれない
        expect(json.map {|c| c["id"] }).to contain_exactly(
          this_month_card_a.id,
          this_month_card_b.id,
        )

        # データの中身チェック
        card = json.find {|c| c["id"] == this_month_card_a.id }
        expect(card["content"]).to eq this_month_card_a.content
        expect(card["logged_date"]).to eq this_month_card_a.logged_date.to_s
      end
    end

    context "認証なし" do
      it "401 Unauthorized が返る" do
        get "/api/v1/cards/deck/#{year}/#{month}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  # show
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

  # create
  describe "POST /api/v1/cards" do
    let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

    context "正常系" do
      it "新しいカードを作成し 201 を返す" do
        valid_params = { card: { content: "ありがとう！", logged_date: Time.zone.today } }.to_json

        expect {
          post "/api/v1/cards", params: valid_params, headers: headers
        }.to change { Card.count }.by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json).to include("id", "content", "logged_date")
      end
    end

    context "上限超過時" do
      before do
        create_list(:card, 3, user: user, logged_date: Time.zone.today)
      end

      it "422 エラーを返す" do
        params = { card: { content: "追加できない", logged_date: Time.zone.today } }.to_json
        post "/api/v1/cards", params: params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("この日のカードは上限に達しました")
      end
    end

    context "バリデーション失敗時" do
      it "422 エラーを返す" do
        invalid_params = { card: { content: "", logged_date: nil } }.to_json
        post "/api/v1/cards", params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("感謝内容を入力してください", "記録日を入力してください")
      end
    end

    context "認証なし" do
      it "401 を返す" do
        post "/api/v1/cards", params: {}.to_json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  # update
  describe "PATCH /api/v1/cards/:id" do
    let(:card)    { cards.first }
    let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

    context "正常系" do
      it "カードを更新し 200 を返す" do
        params = { card: { content: "更新しました" } }.to_json
        patch "/api/v1/cards/#{card.id}", params: params, headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json["content"]).to eq("更新しました")
      end
    end

    context "バリデーション失敗時" do
      it "422 を返す" do
        params = { card: { content: "" } }.to_json
        patch "/api/v1/cards/#{card.id}", params: params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("感謝内容を入力してください")
      end
    end

    context "認証なし" do
      it "401 を返す" do
        patch "/api/v1/cards/#{card.id}", params: {}.to_json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  # delete
  describe "DELETE /api/v1/cards/:id" do
    let!(:card)    { create(:card, user: user) }
    let(:headers) { auth_headers_for(user).merge("Content-Type" => "application/json") }

    context "正常系" do
      it "204 を返し、レコードを削除する" do
        expect {
          delete "/api/v1/cards/#{card.id}", headers: headers
        }.to change { Card.count }.by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end

    context "認証なし" do
      it "401 を返す" do
        delete "/api/v1/cards/#{card.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
