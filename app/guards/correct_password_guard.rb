class CorrectPasswordGuard < Clearance::SignInGuard
  def call
    if signed_in?
      next_guard
    else
      failure :incorrect_login
    end
  end
end
