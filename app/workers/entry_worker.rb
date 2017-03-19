class EntryWorker
  include Sidekiq::Worker

  def perform(entry_id, method_name)
    entry = Entry.find_by(id: entry_id)
    entry.send(method_name) if entry.present?
  end
end
