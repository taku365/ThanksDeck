class GenerateReplyJob < ApplicationJob
  queue_as :default # Sidekiq の default キューに入る

  def perform(card_id)
    card = Card.find(card_id)
    return if card.reply.present? # 既に生成済みなら何もしない

    reply_text = OpenaiClient.generate_reply(card.content)
    card.update!(reply: reply_text)
  rescue => e
    Rails.logger.error "GenerateReplyJob failed: #{e.message}"
    raise e # Sidekiq の自動リトライを使う
  end
end
