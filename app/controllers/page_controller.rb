class PageController < ApplicationController
  def index
    return redirect_to '/' unless request.format == :html
    render 'layouts/application', layout: false
  end
end
