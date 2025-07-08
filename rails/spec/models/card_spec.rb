require "rails_helper"

RSpec.describe Card, type: :model do
  # テスト中は外部 API 呼び出しをせず、固定の返信を返すようにスタブする
  before do
    allow(OpenaiClient).to receive(:generate_reply).and_return("テスト返信")
  end

  describe "新規作成" do
    context "factoryのデフォルト設定に従った時" do
      subject { create(:card) }

      it "カードを新規作成できる" do
        expect { subject }.to change { Card.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:card) }

    context "content が空の時" do
      before { record.content = nil }

      it "エラーメッセージが返る" do
        expect(record).not_to be_valid
        expect(record.errors.full_messages).to eq ["感謝内容を入力してください"]
      end
    end

    context "感謝内容が140文字を超える時" do
      before { record.content = "a" * 141 }

      it "エラーメッセージが返る" do
        expect(record).not_to be_valid
        expect(record.errors.full_messages).to eq ["感謝内容は140文字以内で入力してください"]
      end
    end

    context "記録日が指定されていない場合" do
      before { record.logged_date = nil }

      it "エラーメッセージが返る" do
        expect(record).not_to be_valid
        expect(record.errors.full_messages).to eq ["記録日を入力してください"]
      end
    end
  end
end
