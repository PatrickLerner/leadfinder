class UserMailer < ApplicationMailer
  def change_password(user)
    @user = user
    raise 'missing confirmation token' unless user.confirmation_token.present?
    mail(to: user.email, subject: 'Password Reset')
  end
end
