require "rails_helper"

RSpec.describe GenerateReplyJob, type: :job do
  include ActiveJob::TestHelper

  it "カードの内容でOpenaiClientを呼び出す" do
    card = create(:card, content: "ありがとう！")
    allow(OpenaiClient).to receive(:generate_reply).and_return("dummy")

    GenerateReplyJob.new.perform(card.id)

    expect(OpenaiClient).to have_received(:generate_reply).with("ありがとう！")
  end
end
