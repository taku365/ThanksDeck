# エイリアス経由!
class Api::V1::CardsController < Api::V1::BaseController
  before_action :authenticate_user! # ログインユーザーのみ

  # Get /api/v1/cards 一覧取得
  def index
    cards = current_user.cards.order(logged_date: :desc)
    render json: serialize(cards), status: :ok
  end

  # Get /api/v1/cards/:id 詳細取得
  def show
    card = current_user.cards.find(params[:id])
    render json: serialize(card), status: :ok
  end

  private

    def serialize(resource)
      resource.as_json(only: %i[id content logged_date])
    end
end
