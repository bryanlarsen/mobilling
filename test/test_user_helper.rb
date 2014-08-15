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

    def screenshot(wait_time = 1)
      sleep(wait_time)
      session.save_screenshot(Rails.root.join("tmp", "screenshot.png"), width: 1024, height: 768)
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
      navigate_to("Sign out")
    end

    def fill_in(*args, **options)
      blur = options.delete(:blur)
      session.fill_in(*args, **options).tap { find("body").click if blur }
    end

    def navigate_to(title)
      click_on("Menu")
      sleep(0.5) # wait for menu to open
      click_on(title)
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

  class Admin < User
    def initialize(user = FactoryGirl.create(:admin_user, role: "admin"))
      super(user)
    end

    def sign_in
      visit(admin_root_path)
      fill_in("Email", with: email)
      fill_in("Password", with: password)
      click_on("Sign In")
    end

    def sign_out
      click_on("Sign Out")
    end

    def navigate_to(title)
      within(".navbar") { click_on(title) }
    end
  end
end
