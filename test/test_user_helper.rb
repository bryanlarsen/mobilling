module Test
  module SessionPool
    mattr_accessor :idle, :taken

    self.idle = []
    self.taken = []

    def self.release
      idle.concat(taken)
      taken.clear
    end

    def self.take
      (idle.pop || Capybara::Session.new(:poltergeist, Rails.application)).tap do |session|
        session.reset!
        session.visit("/#/sign-out")
        taken.push(session)
      end
    end
  end

  class User < SimpleDelegator
    attr_reader :session, :model

    include Rails.application.routes.url_helpers
    include FactoryGirl::Syntax::Methods

    Capybara::Session::DSL_METHODS.each do |method|
      define_method method do |*args, &block|
        session.send method, *args, &block
      end
    end

    def initialize(user)
      super
      @model = user
      @session = Test::SessionPool.take
    end

    def debug
      session.driver.debug
    end

    def screenshot
      session.save_screenshot(Rails.root.join("tmp", "screenshot.png"), full: true)
    end

    def see?(*args)
      has_content?(*args)
    end

    def not_see?(*args)
      has_no_content?(*args)
    end

    def emails
      ActionMailer::Base.deliveries.select { |mail| mail.to.include?(email) }
    end

    def sign_in
      visit(root_path)
      fill_in("Email", with: email)
      fill_in("Password", with: password)
      click_on("Sign In")
    end

    def sign_out
      click_on("Sign Out")
    end

    def click_link_with_text(text)
      find(:xpath, "//a[contains(., '#{text}')]").click
    end

    def click_element_with_id(id)
      find(:css, "##{id}").click
    end

    def has_element_with_class?(cls)
      has_selector?(".#{cls}")
    end
  end

  class Guest < User
    def initialize(attributes = {})
      guest = OpenStruct.new(attributes.reverse_merge(name: "Guest", email: "guest@example.com"))
      super(guest)
    end
  end

  class Doctor < User
    def initialize(user = FactoryGirl.create(:user, :authenticated))
      super(user)
    end
  end
end
