# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
# === ゲストユーザーシード ===
guest = User.find_or_create_by!(email: "test1@example.com") do |u|
  u.name                  = "テスト太郎"
  u.password              = "password"
  u.password_confirmation = "password"
  u.confirmed_at          = Time.current
end

# === ThanksCard のサンプルデータ ===
5.times do |i|
  logged_date = Time.zone.today - i.days
  guest.cards.find_or_create_by!(logged_date: logged_date) do |card|
    card.content = "サンプル感謝 #{i + 1}"
  end
end
