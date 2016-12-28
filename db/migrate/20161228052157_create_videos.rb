class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.datetime :video_date
      t.string :video_type
      t.string :title
      t.string :share
      t.string :place
      t.string :description
      t.string :image
      t.boolean :sponsored
      t.boolean :ad

      t.timestamps null: false
    end
  end
end
