class Entry < ApplicationRecord
  module Name
    extend ActiveSupport::Concern

    TITLES = %w(PROF PROFESSOR DR DOC DOCTOR MR MRS MISS FRAU HERR REVERREND REV).freeze

    def name=(name)
      parts = name.split(' ').reverse
      parts = extract_title_from_name(parts)
      self.first_name = parts.pop
      self.last_name = parts[0]
      middle_parts = parts[1..-1] || []
      self.middle_name = middle_parts.reverse.join(' ')
    end

    def name
      [title, first_name, middle_name, last_name].compact.join(' ')
    end

    protected

    def extract_title_from_name(parts)
      titles = []
      loop do
        last_part = parts.last.upcase.gsub(/\.$/, '')
        break unless last_part.in?(TITLES)
        titles << parts.last
        parts.pop
      end
      self.title = titles.join(' ')
      parts
    end
  end
end
