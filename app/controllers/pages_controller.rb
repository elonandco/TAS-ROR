class PagesController < ApplicationController
  def index
    @events = Event.all.order("event_date asc")

    @type = params[:type]

    @event_ids = Event.all.order("id asc").pluck(:id).join(", ")
    @blog_ids = Blog.all.order("id asc").pluck(:id).join(", ")
    @pic_ids = Picture.all.order("id asc").pluck(:id).join(", ")
    @video_ids = Video.all.order("id asc").pluck(:id).join(", ")
  end

  def blogs
  	blogs = Blog.all.order("id asc")

    @blogs = []

  	if blogs.present?
  		blogs.each do |blog|
        @blogs << { id: blog.id, type: blog.blog_type, title: blog.title, share: blog.share, description: blog.description, image: blog.image, sponsored: blog.sponsored, ad: blog.ad }
      end
  	end

    return render xml: @blogs.to_xml(root: "articles") 
  end

  def events
    events = Event.all.order("id asc")

    @events = []

    if events.present?
      events.each do |event|
        dayofweek = ""
        month = ""
        time = ""
        
        if event.event_date.present?
          dayofweek = event.event_date.strftime("%A")
          month = event.event_date.strftime("%b. %d")
          time = event.start_time.strftime("%I%P") + " - " + event.start_time.strftime("%I%P")
        end
        
        @events << { id: event.id, dayofweek: dayofweek, month: month, title: event.title, type: event.event_type, time: time, place: event.place, image: event.image, sponsored: event.sponsored, ad: event.ad, description: event.description }
      end
    end

    return render xml: @events.to_xml(root: "articles")
  end

  def pictures
    pictures = Picture.all.order("id asc")

    @pictures = []

    if pictures.present?
      pictures.each do |picture|
        dayofweek = ""
        month = ""
        
        if picture.picture_date.present?
          dayofweek = picture.picture_date.strftime("%A")
          month = picture.picture_date.strftime("%b. %d")
        end
        
        @pictures << { id: picture.id, dayofweek: dayofweek, month: month, title: picture.title, type: picture.picture_type, place: picture.place, image: picture.image, sponsored: picture.sponsored, ad: picture.ad, description: picture.description }
      end
    end

    return render xml: @pictures.to_xml(root: "articles")
  end

  def videos
    videos = Video.all.order("id asc")

    @videos = []

    if videos.present?
      videos.each do |video|
        dayofweek = ""
        month = ""
        
        if video.video_date.present?
          dayofweek = video.video_date.strftime("%A")
          month = video.video_date.strftime("%b. %d")
        end
        
        @videos << { id: video.id, dayofweek: dayofweek, month: month, title: video.title, type: video.video_type, place: video.place, image: video.image, sponsored: video.sponsored, ad: video.ad, description: video.description }
      end
    end

    return render xml: @videos.to_xml(root: "articles")
  end
end
