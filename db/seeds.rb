unless User.where(name: "Test Agent 1").exists?
  p "Creating Test Agents"
  (1..5).each do |num|
    name = "Test Agent #{num}"
    User.create!(
      name: name,
      email: "test_agent_#{num}@agency.com",
      role: "agent"
    )
    p "Create #{name}"
  end
end