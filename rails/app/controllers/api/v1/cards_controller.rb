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

  # POST /api/v1/cards
  def create
    # 今日の作成済みカード数をカウント
    today_count = current_user.cards.where(logged_date: Time.zone.today).count

    if today_count >= 3
      return render json: { errors: ["今日のカードは上限に達しました"] },
                    status: :unprocessable_entity
    end

    card = current_user.cards.build(card_params)
    if card.save
      render json: card.as_json(only: %i[id content logged_date]),
             status: :created
    else
      render json: { errors: card.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  private

    # 属性を限定してハッシュ化
    def serialize(resource)
      resource.as_json(only: %i[id content logged_date])
    end

    def card_params
      params.require(:card).permit(:content, :logged_date)
    end
end
