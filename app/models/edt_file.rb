class EdtFile < ActiveRecord::Base
	enum status: %i[ready uploaded acknowledged processed]
end
