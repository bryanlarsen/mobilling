json.id                   user.id
json.name                 user.name
json.email                user.email
json.agent_id             user.agent_id
json.agents               User.where(role: "agent").map{|user| {id: user.id, name: user.name}}
json.authentication_token user.authentication_token
