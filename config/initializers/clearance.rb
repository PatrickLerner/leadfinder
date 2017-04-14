Clearance.configure do |config|
  config.routes = false
  config.mailer_sender = 'patrick@instaffo.de'
  config.rotate_csrf_on_sign_in = true
  # order here is important (!)
  config.sign_in_guards = [ConfirmedUserGuard, CorrectPasswordGuard]
end
