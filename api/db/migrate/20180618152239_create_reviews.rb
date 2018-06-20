class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.string :user
      t.text :content
      t.integer :place_id
      t.timestamps
    end
  end
end
