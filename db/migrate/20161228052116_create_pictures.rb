class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
      t.datetime :picture_date
      t.string :picture_type
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
