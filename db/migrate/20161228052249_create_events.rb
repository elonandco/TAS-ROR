class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :event_date
      t.datetime :start_time
      t.datetime :end_time
      t.string :event_type
      t.string :title
      t.string :place
      t.string :description
      t.string :image
      t.string :sponsored
      t.string :ad

      t.timestamps null: false
    end
  end
end
