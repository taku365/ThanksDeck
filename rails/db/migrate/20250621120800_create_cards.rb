class CreateCards < ActiveRecord::Migration[7.1]
  def change
    create_table :cards do |t|
      t.text    :content,     comment: "感謝内容(最大140文字)"
      t.date    :logged_date, comment: "記録日"
      t.references :user,     null: false, foreign_key: true

      t.timestamps
    end
  end
end
