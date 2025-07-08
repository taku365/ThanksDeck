class Card < ApplicationRecord
  belongs_to :user

  validates :content, presence: true, length: { maximum: 140 }
  validates :logged_date, presence: true

  # カード保存後にジョブをキック
  after_commit :enqueue_reply_job, on: :create

  private

    def enqueue_reply_job
      GenerateReplyJob.perform_later(id)
    end
end
