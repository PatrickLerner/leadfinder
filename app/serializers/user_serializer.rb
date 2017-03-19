class UserSerializer < ActiveModel::Serializer
  attributes :id, :gender, :first_name, :last_name, :email, :language
end
