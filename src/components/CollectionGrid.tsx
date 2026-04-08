import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const collections = [
  {
    title: 'Best Sellers',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
    link: '/shop',
  },
  {
    title: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
    link: '/shop',
  },
  {
    title: 'Personalized',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=600&fit=crop',
    link: '/create',
  },
  {
    title: 'Name Chains',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=600&fit=crop',
    link: '/shop?category=name-chains',
  },
  {
    title: 'Most Gifted',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop',
    link: '/shop',
  },
];

const CollectionGrid = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collections.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={c.link}
              className="group block relative overflow-hidden rounded-2xl aspect-[3/4] bg-secondary border border-border"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{c.title}</h3>
                <span className="font-body text-xs text-primary font-semibold mt-1 inline-block group-hover:underline">
                  Shop Now →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CollectionGrid;
