namespace :test do
  Rails::TestTask.new(javascripts: "teaspoon")

  Rake::Task["test:run"].enhance { Rake::Task["test:javascripts"].invoke }
end
