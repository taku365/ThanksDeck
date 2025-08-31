class GenerateReplyJob < ApplicationJob
  queue_as :default

  def perform(card_id)
    card = Card.find(card_id)
    reply_text = OpenaiClient.generate_reply(card.content)
    card.update!(reply: reply_text)
  rescue => e
    Rails.logger.error "GenerateReplyJob failed: #{e.message}"
    raise e
  end
end
