namespace :test do
  Rails::TestTask.new(interactors: "test:prepare") do |t|
    t.pattern = "test/interactors/**/*_test.rb"
  end

  Rake::Task["test:run"].enhance { Rake::Task["test:interactors"].invoke }
end
