class EntryWorker
  include Sidekiq::Worker

  def perform(entry_id, method_name)
    Entry.find(entry_id).send(method_name)
  end
end
