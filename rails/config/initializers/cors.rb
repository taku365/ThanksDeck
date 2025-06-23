# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins Settings.front_domain # 環境に応じた設定ファイルに切り替え,本番環境は実際のドメイン（実装はまだ）

    resource "*",
             headers: :any,
             expose: ['access-token', 'uid','client'],
             methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
