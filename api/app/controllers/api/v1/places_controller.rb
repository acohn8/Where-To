module Api
  module V1
    class PlacesController < ApplicationController
      def index
        render json: Place.includes(:reviews), include: ['reviews']
      end
    end
  end
end
