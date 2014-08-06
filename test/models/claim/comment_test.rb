require "test_helper"

class Claim::CommentTest < ActiveSupport::TestCase
  setup do
    @claim_comment = build(:claim_comment)
  end

  test "saves successfully with valid attributes" do
    assert @claim_comment.save!
  end
end
