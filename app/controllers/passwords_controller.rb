class PasswordsController < ApplicationController
  def new
    @interactor = CreatePassword.new(token: params[:token])
    if @interactor.perform
      render text: "created"
    else
      render text: "not found"
    end
  end
end
