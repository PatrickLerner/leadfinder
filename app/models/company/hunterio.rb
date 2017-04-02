require 'hunter'

class Company::Hunterio < ApplicationRecord
  validates :domain, presence: true, uniqueness: true
  validates :response, presence: true

  HUNTER_PATTERN_MATCHING = {
    '{first}': '%{fn}',
    '{last}': '%{ln}',
    '{f}': '%{fi}',
    '{l}': '%{li}'
  }.freeze

  def self.find_domain(domain)
    res = find_or_initialize_by(domain: domain)
    unless res.persisted?
      res.lookup_domain!
      res.save! unless res.response.nil?
    end
    res
  end

  def response
    return nil if read_attribute(:response).nil?
    JSON.parse(read_attribute(:response)).try(:with_indifferent_access)
  end

  def response=(val)
    write_attribute(:response, val.to_json)
  end

  def pattern
    return nil unless response.present? && response.key?(:pattern)
    pattern = response[:pattern] || ''
    convert_hunter_pattern(pattern)
  end

  def lookup_domain!
    raise 'no domain was provided' if domain.nil? || domain.blank?
    response_data = api.domain_search(domain)
    update_attribute(:response, response_data)
  end

  protected

  def convert_hunter_pattern(pattern)
    res = pattern
    HUNTER_PATTERN_MATCHING.each do |h_pattern, l_pattern|
      res.gsub!(/#{h_pattern}/, l_pattern)
    end
    res
  end

  def api
    @api ||= ::Hunter.new(Rails.application.secrets.hunter_io_api)
  end
end
