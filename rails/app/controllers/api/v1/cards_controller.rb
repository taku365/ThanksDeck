# エイリアス経由!
class Api::V1::CardsController < Api::V1::BaseController
  before_action :authenticate_user! # ログインユーザーのみ

  # Get /api/v1/cards 一覧取得
  def index
    cards = current_user.cards.order(logged_date: :desc)
    render json: serialize(cards), status: :ok
  end

  # GET /api/v1/cards/today　今日のカード一覧
  def today
    today_date = Date.current
    cards = current_user.cards.where(logged_date: today_date).order(logged_date: :desc)
    render json: serialize(cards), status: :ok
  end

  # GET /api/v1/cards/deck/:year/:month 今月のカード一覧取得
  def deck
    year = params[:year].to_i
    month = params[:month].to_i

    first_day = Date.new(year, month, 1)
    last_day = first_day.end_of_month

    scope = current_user.cards.where(logged_date: first_day..last_day).order(logged_date: :desc)
    cards = scope.page(params[:page]).per(params[:per] || 6)

    render json: {
      cards: serialize(cards),
      meta: {
        current_page: cards.current_page,
        total_pages: cards.total_pages,
        total_count: cards.total_count,
      },
    }, status: :ok
  rescue ArgumentError
    # Date.new の引数が不正だった場合
    render json: { errors: ["無効な年月です"] },
           status: :bad_request
  end

  # Get /api/v1/cards/:id 詳細取得
  def show
    card = current_user.cards.find(params[:id])
    render json: serialize(card), status: :ok
  end

  # POST /api/v1/cards カードの作成
  def create
    # 作成しようとしている日付のカード数をカウント
    target_date = card_params[:logged_date]
    today_count = current_user.cards.where(logged_date: target_date).count

    if today_count >= 3
      return render json: { errors: ["この日のカードは上限に達しました"] },
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

  # PATCH/PUT /api/v1/cards/:id
  def update
    card = current_user.cards.find(params[:id])

    if card.update(card_params)
      render json: card.as_json(only: %i[id content logged_date]), status: :ok
    else
      render json: { errors: card.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/cards/:id
  def destroy
    card = current_user.cards.find(params[:id])
    card.destroy!
    head :no_content
  end

  private

    # 属性を限定してハッシュ化
    def serialize(resource)
      resource.as_json(only: %i[id content logged_date reply])
    end

    # card 以下のパラメータから content と logged_date のみを許可して安全に受け取る
    def card_params
      params.require(:card).permit(:content, :logged_date)
    end
end
