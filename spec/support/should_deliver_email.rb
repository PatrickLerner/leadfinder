def should_deliver_email(to:, subject:)
  expect(ActionMailer::Base.deliveries).not_to be_empty

  email = ActionMailer::Base.deliveries.last
  expect(email).to deliver_to(to)
  expect(email).to have_subject(subject)
end
