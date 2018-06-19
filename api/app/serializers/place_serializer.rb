class PlaceSerializer < ActiveModel::Serializer
  attributes :foursquare_id
  has_many :reviews
end
