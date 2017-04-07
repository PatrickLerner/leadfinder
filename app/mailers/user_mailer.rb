class UserMailer < ApplicationMailer
  def change_password(user)
    @user = user
    raise 'missing confirmation token' unless user.confirmation_token.present?
    mail(to: user.email, subject: 'Password Reset')
  end

  def registration_confirmation(user)
    @user = user
    raise 'missing confirmation token' unless user.email_confirmation_token.present?
    mail(to: user.email, subject: 'Welcome to Lead Finder!')
  end
end
