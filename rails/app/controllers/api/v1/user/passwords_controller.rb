class Api::V1::User::PasswordsController < DeviseTokenAuth::PasswordsController
  # rubocop:disable Metrics/MethodLength, Metrics/AbcSize, Metrics/PerceivedComplexity
  def edit
    @resource = resource_class.with_reset_password_token(resource_params[:reset_password_token])

    if @resource && @resource.reset_password_period_valid?
      token = @resource.create_token unless require_client_password_reset_token?

      @resource.skip_confirmation! if confirmable_enabled? && !@resource.confirmed_at

      @resource.allow_password_change = true if recoverable_enabled?

      @resource.save!

      yield @resource if block_given?

      if require_client_password_reset_token?
        redirect_to DeviseTokenAuth::Url.generate(@redirect_url, reset_password_token: resource_params[:reset_password_token]),
                    allow_other_host: true
      else
        if DeviseTokenAuth.cookie_enabled
          set_token_in_cookie(@resource, token)
        end

        redirect_header_options = { reset_password: true }
        redirect_headers = build_redirect_headers(token.token, token.client, redirect_header_options)
        redirect_to(@resource.build_auth_url(@redirect_url, redirect_headers), allow_other_host: true)
      end
    else
      render_edit_error
    end
  end
  # rubocop:enable Metrics/MethodLength, Metrics/AbcSize, Metrics/PerceivedComplexity
end
