require "test_helper"

class UpdateClaimTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @interactor = UpdateClaim.new()
  end
end
