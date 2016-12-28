class CreateBlogs < ActiveRecord::Migration
  def change
    create_table :blogs do |t|
      t.string :blog_type
      t.string :title
      t.string :share
      t.string :description
      t.string :image
      t.boolean :sponsored
      t.boolean :ad

      t.timestamps null: false
    end
  end
end
