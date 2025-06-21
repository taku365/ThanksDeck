FactoryBot.define do
  factory :card do
    association :user # Userファクトリが必要
    content { "今日感謝したこと" }
    logged_date { Time.zone.today }
  end
end
