class Entry < ApplicationRecord
  module Urls
    extend ActiveSupport::Concern

    included do
      before_save :persist_urls
    end

    def urls
      @urls || current_urls
    end

    def urls=(vals)
      @urls ||= vals
    end

    protected

    def current_urls
      (links.loaded? ? links.map(&:url) : links.pluck(:url)).sort
    end

    def persist_urls
      return if @urls.nil?
      removed_urls = current_urls - @urls
      added_urls = @urls - current_urls
      links.select { |link| link.url.in?(removed_urls) }.each(&:mark_for_destruction)
      added_urls.each { |url| links.build(url: url) }
    end
  end
end
