module Api
  module V1
    class PlacesController < ApplicationController
      def index
        render json: Place.includes(:reviews), include: ['reviews']
      end

      def create
        place = Place.find_or_create_by(foursquare_id: place_params['place']['foursquare_id'])
        render json: Review.create(user: place_params['place']['reviews'][0]['user'], content: place_params['place']['reviews'][0]['content'], place: place)
      end

      private
      def place_params
        params.permit(place: [:foursquare_id, { reviews: [:user, :content] } ])
      end
    end
  end
end
