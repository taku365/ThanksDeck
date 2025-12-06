# frozen_string_literal: true

class OpenaiClient
  MODEL = "gpt-4.1-nano"

  def self.generate_reply(user_content)
    api_key =
      ENV["OPENAI_API_KEY"].presence ||
      Rails.application.credentials.dig(Rails.env.to_sym, :openai, :api_key).presence

    return nil if api_key.blank?

    client = OpenAI::Client.new(access_token: api_key)

    response = client.chat(
      parameters: {
        model: MODEL,
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_content },
        ],
        temperature: 0.7,
      },
    )

    text = response.dig("choices", 0, "message", "content")
    text&.slice(0, 140)
  end

  def self.system_prompt
    <<~PROMPT
      あなたは「感謝カードにそっと共感を添えるアシスタント」です。
      ユーザーの言葉に対して「対話」ではなく、その気持ちを受け止めて、
      前向きになれる一言を返してください。

      ユーザーにお礼を返す・会話相手になる・同じ感謝を返す行為は避けてください。
      日記を読むように、気持ちに寄り添い価値をそっと言語化する役割です。

      140文字以内の日本語で、まあまあフレンドリーに返信してください。
      絵文字も積極的に使ってください。
    PROMPT
  end
end
