import { Star } from "lucide-react";

const renderStars = (rating) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    if (numericRating >= i) {
      // Full star
      stars.push(
        <Star
          key={i}
          className="w-5 h-5 text-yellow-400 fill-current"
        />
      );
    } else if (numericRating >= i - 0.5) {
      // Half star (visual trick)
      stars.push(
        <div key={i} className="relative w-5 h-5">
          <Star className="absolute text-gray-300 w-5 h-5" />
          <div className="overflow-hidden w-1/2">
            <Star className="text-yellow-400 fill-current w-5 h-5" />
          </div>
        </div>
      );
    } else {
      // Empty star
      stars.push(
        <Star key={i} className="w-5 h-5 text-gray-300" />
      );
    }
  }

  return stars;
};

export default renderStars;