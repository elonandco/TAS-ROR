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

    @blogs = blog_results(blogs)

    return render xml: @blogs.to_xml(root: "articles") 
  end

  def events
    events = Event.all.order("id asc")

    @events = event_results(events)

    return render xml: @events.to_xml(root: "articles")
  end

  def pictures
    pictures = Picture.all.order("id asc")

    @pictures = picture_results(pictures)

    return render xml: @pictures.to_xml(root: "articles")
  end

  def videos
    videos = Video.all.order("id asc")

    @videos = video_results(videos)

    return render xml: @videos.to_xml(root: "articles")
  end

  def search
    @results = []
    if params[:time].present?
      # if params[:section_type].present?
      section = params[:section_type].present? ? params[:section_type] : nil
      # else
        if params[:time] == "1"
          date = Date.today
          
          @results = section.present? ? results_in_a_day(date, section) : all_results_in_a_day(date)
        elsif params[:time] == "2"
          
          date = Date.today + 1
          @results = section.present? ? results_in_a_day(date, section) : all_results_in_a_day(date)
        
        elsif params[:time] == "3"
          
          date = Date.today
          @results = all_results_in_a_week(date)
        
        elsif params[:time] == "4"
          
          @results = all_results_by_weekend
        
        elsif params[:time] == "5"
          
          date = Date.today + 7
          @results = all_results_in_a_week(date)
        
        elsif params[:time] == "6"
          
          start_date = Date.today + 1
          end_date   = Date.today + 30
          @results = all_results_by_range(start_date, end_date)
        
        end
      # end
      render json: { results: @results, status: 200 }, status: 200
    elsif params[:start_date].present?
      start_date = params[:start_date].to_date
      end_date   = params[:end_date].present? ? params[:end_date].to_date : ""
      
      if params[:section_type].present?
        section = params[:section_type]

        if section == "events"
          
          events   = params[:start_date].present? && params[:end_date].present? ? events_by_range(start_date, end_date) : results_in_a_day(start_date, section)
          @results = @results + event_results(events)
        
        elsif section == "blogs"
          
          blogs    = params[:start_date].present? && params[:end_date].present? ? blogs_by_range(start_date, end_date) : results_in_a_day(start_date, section)
          @results = @results + blog_results(blogs)
        
        elsif section == "pictures"
          
          pictures = params[:start_date].present? && params[:end_date].present? ? pictures_by_range(start_date, end_date) : results_in_a_day(start_date, section)
          @results = @results + picture_results(pictures)
        
        elsif section == "videos"
          
          videos   = params[:start_date].present? && params[:end_date].present? ? videos_by_range(start_date, end_date) : results_in_a_day(start_date, section)
          @results = @results + video_results(videos) 
        
        end           
      else
        @results = params[:start_date].present? && params[:end_date].present? ? all_results_by_range(start_date, end_date) : all_results_in_a_day(start_date)     
      end
      render json: { results: @results, status: 200 }, status: 200
    else
      render json: { message: "You must first select a day or a range or just pick a time.", status: 300 }, status: 300
    end
  end

  private

    def event_results(events)
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
          
          @events << { id: event.id, dayofweek: dayofweek, month: month, title: event.title, type: event.event_type, mask_title: event.title, mask_type: event.event_type, time: time, place: event.place, image: event.image, sponsored: event.sponsored, ad: event.ad, description: event.description, section_type: "event" }
        end
      end

      return @events
    end

    def blog_results(blogs)
      @blogs = []

      if blogs.present?
        blogs.each do |blog|
          @blogs << { id: blog.id, type: blog.blog_type, title: blog.title, mask_type: blog.blog_type, mask_title: blog.title, share: blog.share, description: blog.description, image: blog.image, sponsored: blog.sponsored, ad: blog.ad, section_type: "blog" }
        end
      end

      return @blogs
    end

    def picture_results(pictures)
      @pictures = []

      if pictures.present?
        pictures.each do |picture|
          dayofweek = ""
          month = ""
          
          if picture.picture_date.present?
            dayofweek = picture.picture_date.strftime("%A")
            month = picture.picture_date.strftime("%b. %d")
          end
          
          @pictures << { id: picture.id, dayofweek: dayofweek, month: month, title: picture.title, mask_title: picture.title, type: picture.picture_type, place: picture.place, image: picture.image, sponsored: picture.sponsored, ad: picture.ad, description: picture.description, section_type: "picture" }
        end
      end

      return @pictures
    end

    def video_results(videos)
      @videos = []

      if videos.present?
        videos.each do |video|
          dayofweek = ""
          month = ""
          
          if video.video_date.present?
            dayofweek = video.video_date.strftime("%A")
            month = video.video_date.strftime("%b. %d")
          end
          
          @videos << { id: video.id, dayofweek: dayofweek, month: month, title: video.title, type: video.video_type, place: video.place, image: video.image, sponsored: video.sponsored, ad: video.ad, description: video.description, section_type: "video" }
        end
      end

      return @videos
    end

    def events_by_range(start_date, end_date)
      return Event.where("DATE(event_date) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
    end

    def blogs_by_range(start_date, end_date)
      return Blog.where("DATE(updated_at) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
    end

    def pictures_by_range(start_date, end_date)
      return Picture.where("DATE(picture_date) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
    end

    def videos_by_range(start_date, end_date)
      return Video.where("DATE(video_date) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
    end

    def all_results_by_range(start_date, end_date)
      @results = []

      events   =  Event.where("DATE(event_date) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
      @results = @results + event_results(events)
    
      blogs    = Blog.where("DATE(updated_at) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
      @results = @results + blog_results(blogs)
    
      pictures = Picture.where("DATE(picture_date) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
      @results = @results + picture_results(pictures)
    
      videos   = Video.where("DATE(video_date) BETWEEN DATE(?) AND DATE(?)", start_date, end_date)
      @results = @results + video_results(videos)

      return @results
    end

    def results_in_a_day(date, type)
      if type == "events"
        return Event.where("DATE(event_date) = DATE(?)", date)
      elsif type == "blogs"
        return Blog.where("DATE(updated_at) = DATE(?)", date)
      elsif type == "pictures"
        return Picture.where("DATE(picture_date) = DATE(?)", date)
      elsif type == "videos"
        return Video.where("DATE(video_date) = DATE(?)", date)
      end      
    end

    def all_results_in_a_day(date)
      @results = []

      events   = Event.where("DATE(event_date) = DATE(?)", date)
      @results = @results + event_results(events)

      blogs    = Blog.where("DATE(updated_at) = DATE(?)", date)
      @results = @results + blog_results(blogs)

      pictures = Picture.where("DATE(picture_date) = DATE(?)", date)
      @results = @results + picture_results(pictures)

      videos   = Video.where("DATE(video_date) = DATE(?)", date)
      @results = @results + video_results(videos)

      return @results
    end

    def all_results_in_a_week(date)      
      @results = []

      events   = Event.where("DATE(event_date) BETWEEN DATE(?) AND DATE(?)", date.beginning_of_week, date.end_of_week)
      @results = @results + event_results(events)

      blogs    = Blog.where("DATE(updated_at) BETWEEN DATE(?) AND DATE(?)", date.beginning_of_week, date.end_of_week)
      @results = @results + blog_results(blogs)

      pictures = Picture.where("DATE(picture_date) BETWEEN DATE(?) AND DATE(?)", date.beginning_of_week, date.end_of_week)
      @results = @results + picture_results(pictures)

      videos   = Video.where("DATE(video_date) BETWEEN DATE(?) AND DATE(?)", date.beginning_of_week, date.end_of_week)
      @results = @results + video_results(videos)

      return @results
    end

    def all_results_by_weekend
      date = Date.today
      
      sat = (date.beginning_of_week..date.end_of_week).group_by(&:wday)[6][0]

      sun = (date.beginning_of_week..date.end_of_week).group_by(&:wday)[0][0]

      @results = []

      events   = Event.where("DATE(event_date) = DATE(?) or DATE(event_date) = DATE(?)", sat, sun)
      @results = @results + event_results(events)

      blogs    = Blog.where("DATE(updated_at) = DATE(?) or DATE(updated_at) = DATE(?)", sat, sun)
      @results = @results + blog_results(blogs)

      pictures = Picture.where("DATE(picture_date) = DATE(?) or DATE(picture_date) = DATE(?)", sat, sun)
      @results = @results + picture_results(pictures)

      videos   = Video.where("DATE(video_date) = DATE(?) or DATE(video_date) = DATE(?)", sat, sun)
      @results = @results + video_results(videos)

      return @results
    end
end
