module AuthHelpers
  # メソッド定義
  def auth_headers_for(user)
    post "/api/v1/auth/sign_in", # PostはRequest Spec が提供しているメソッドを呼び出している
         params: { email: user.email, password: user.password }.to_json,
         headers: { "Content-Type" => "application/json" }

    {
      "access-token" => response.headers["access-token"],
      "client" => response.headers["client"],
      "uid" => response.headers["uid"],
    }
  end
end
