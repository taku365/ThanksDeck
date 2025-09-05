port ENV.fetch("PORT") { 3000 }
bind "tcp://0.0.0.0:3000"
environment ENV.fetch("RAILS_ENV") { "production" }
workers ENV.fetch("WEB_CONCURRENCY", 0).to_i
threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }.to_i
threads threads_count, threads_count
preload_app!
