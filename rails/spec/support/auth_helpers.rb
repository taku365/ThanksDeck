module AuthHelpers
  def auth_headers_for(user)
    post "/api/v1/auth/sign_in",
         params: { email: user.email, password: user.password }.to_json,
         headers: { "Content-Type" => "application/json" }

    {
      "access-token" => response.headers["access-token"],
      "client" => response.headers["client"],
      "uid" => response.headers["uid"],
    }
  end
end
