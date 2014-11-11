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

    def pick_a_date(locator, date)
      if locator.respond_to?(:click)
        locator.click
      else
        find(:field, locator).click
      end
      date = Date.parse(date)
      months = (date.year * 12 + date.month) - (Date.today.year * 12 + Date.today.month)
      months.abs.times { execute_script("$('.picker--focused .picker__nav--next').click()") } if months > 0
      months.abs.times { execute_script("$('.picker--focused .picker__nav--prev').click()") } if months < 0
      execute_script("$('.picker--focused .picker__day.picker__day--infocus:contains(#{date.day})').click()")
    end

    def pick_a_time(locator, time)
      if locator.respond_to?(:click)
        locator.click
      else
        find(:field, locator).click
      end
      execute_script("$('.picker--focused .picker__list-item:contains(#{time})').click()")
    end

    def navigate_to(title)
      click_on("Menu")
      # need to trigger click, otherwise getting totally random results
      find(:link_or_button, title).trigger("click")
    end

    def press_down_arrow(locator)
      execute_script("$('#{locator}').trigger($.Event('keydown', {keyCode: 40}))")
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

    def add_claim(attributes = {})
      claim_attributes = {
        photo: "image.png",
        patient_name: "Alice",
        hospital: "Test",
        referring_physician: "Bob",
        diagnoses: [{name: "Flu"}],
        most_responsible_physician: true,
        admission_on: "2014-07-02",
        first_seen_on: "2014-07-02",
        first_seen_consult: true,
        icu_transfer: false,
        last_seen_on: "2014-07-02",
        last_seen_discharge: false,
        consult_type: "comprehensive_er",
        consult_time_in: "17:00",
        consult_time_out: "19:00",
        consult_premium_visit: "weekday_office_hours",
        consult_premium_travel: false,
        autogenerate: true,
        daily_details: [{day: "2014-07-02", code: "A666A"}],
        comment: "Test"
      }.merge(attributes)

      click_on("New")

      # patient
      unless claim_attributes[:photo].nil?
        attach_file("Patient photo", Rails.root.join("test", "fixtures", claim_attributes[:photo]), visible: false)
      end
      fill_in("Patient name", with: claim_attributes[:patient_name])

      # claim
      click_on("Claim")
      fill_in("Hospital", with: claim_attributes[:hospital])
      unless claim_attributes[:referring_physician].nil?
        fill_in("Referring physician", with: claim_attributes[:referring_physician])
      end

      claim_attributes[:diagnoses].each.with_index do |diagnosis, i|
        click_on("Add a new diagnosis") unless i.zero?
        fill_in("claim-diagnoses-#{i}-name", with: diagnosis[:name])
      end

      unless claim_attributes[:most_responsible_physician].nil?
        find_by_id("claim-most-responsible-physician").click unless claim_attributes[:most_responsible_physician]
      end

      unless claim_attributes[:procedure_on].nil?
        pick_a_date("Procedure / treatment date", claim_attributes[:procedure_on])
      end

      unless claim_attributes[:admission_on].nil?
        pick_a_date("Admission date", claim_attributes[:admission_on])
      end

      unless claim_attributes[:first_seen_on].nil?
        find_by_id("is-first-seen-on-hidden").click until has_css?("input#claim-first-seen-on")
        pick_a_date("First seen date", claim_attributes[:first_seen_on])
      end

      unless claim_attributes[:first_seen_consult].nil?
        find_by_id("claim-first-seen-consult").click if claim_attributes[:first_seen_consult]
      end

      unless claim_attributes[:icu_transfer].nil?
        find_by_id("claim-icu-transfer").click if claim_attributes[:icu_transfer]
      end

      unless claim_attributes[:last_seen_on].nil?
        pick_a_date("Last seen date", claim_attributes[:last_seen_on])
      end

      unless claim_attributes[:last_seen_discharge].nil?
        find_by_id("claim-last-seen-discharge").click if claim_attributes[:last_seen_discharge]
      end

      # consult
      unless claim_attributes[:consult_type].nil?
        click_on("Consult")
        find_by_id("claim-consult-type-#{claim_attributes[:consult_type].dasherize}").click
        pick_a_time("Time in", claim_attributes[:consult_time_in]) if claim_attributes[:consult_time_in]
        pick_a_time("Time out", claim_attributes[:consult_time_out]) if claim_attributes[:consult_time_out]
        if claim_attributes[:consult_premium_visit]
          find_by_id("is-premium-visible").click
          sleep(0.2)
          find_by_id("claim-consult-premium-visit-#{claim_attributes[:consult_premium_visit].dasherize}").click
        end
        find_by_id("claim-consult-premium-travel").click if claim_attributes[:consult_premium_travel]
      end

      # details
      click_on("Details")
      if claim_attributes[:autogenerate]
        assert_selector(:button, "Generate codes")
        # has_button?("Generate codes")
        click_on("Generate codes")
      end

      claim_attributes[:daily_details].each do |daily_detail|
        all("button.add-code").last.click
        pick_a_date(all("input[name=day]").last, daily_detail[:day])
        all("input[name=code]").last.set(daily_detail[:code])
        pick_a_time(all("input[name=time_in]").last, daily_detail[:time_in]) if daily_detail[:time_in]
        pick_a_time(all("input[name=time_out]").last, daily_detail[:time_out]) if daily_detail[:time_out]
      end

      # comments
      click_on("Comments")
      fill_in("claim-comment", with: claim_attributes[:comment])
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
