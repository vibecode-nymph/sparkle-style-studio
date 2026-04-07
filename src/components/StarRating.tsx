import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
}

const StarRating = ({ rating, size = 'sm' }: StarRatingProps) => {
  const px = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${px} ${i <= Math.round(rating) ? 'fill-primary text-primary' : 'text-border'}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
