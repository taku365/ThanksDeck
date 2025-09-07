class Card < ApplicationRecord
  belongs_to :user

  validates :content, presence: true, length: { maximum: 140 }
  validates :logged_date, presence: true
end
