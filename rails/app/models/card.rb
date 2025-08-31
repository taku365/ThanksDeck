class Card < ApplicationRecord
  belongs_to :user

  validates :content, presence: true, length: { maximum: 140 }
  validates :logged_date, presence: true

  # カード作成・編集後にジョブをキック
  after_create_commit :enqueue_reply_job
  after_update_commit :enqueue_reply_job_if_content_changed

  private

    def enqueue_reply_job
      GenerateReplyJob.perform_later(id)
    end

    def enqueue_reply_job_if_content_changed
      return unless previous_changes.has_key?("content")

      GenerateReplyJob.perform_later(id)
    end
end
