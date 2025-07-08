class AddReplyToCards < ActiveRecord::Migration[7.1]
  def change
    add_column :cards, :reply, :text
  end
end
