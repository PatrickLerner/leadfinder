module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      if clearance.signed_in?
        clearance.current_user
      else
        reject_unauthorized_connection
      end
    end

    def clearance
      env[:clearance]
    end
  end
end
