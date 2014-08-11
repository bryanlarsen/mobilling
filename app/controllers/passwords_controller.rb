class PasswordsController < ApplicationController
  def new
    @interactor = CreatePassword.new(token: params[:token])
    if @interactor.perform
      render "success"
    else
      render "error"
    end
  end
end
