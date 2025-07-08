# frozen_string_literal: true

# OpenAI へ問い合わせて 140 文字以内の返信文を返すユーティリティ
class OpenaiClient
  MODEL = "gpt-4.1-nano"

  def self.generate_reply(user_content)
    client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

    response = client.chat(
      parameters: {
        model: MODEL,
        messages: [
          { role: "system", content: "あなたは優しい励ましの達人である友達です。140文字以内の日本語でフレンドリーに返信してください。" },
          { role: "user",   content: user_content },
        ],
        temperature: 0.7,
      },
    )

    # choices → message → content のネストをたどって実テキストを取得
    text = response.dig("choices", 0, "message", "content")
    text&.slice(0, 140) # 念のため 140 文字で切り捨て
  end
end
