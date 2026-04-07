import { motion } from 'framer-motion';
import { Shield, Droplets, Heart, Award } from 'lucide-react';

const features = [
  { icon: Droplets, title: 'Waterproof', desc: 'Shower in it. Swim in it. Never take it off.' },
  { icon: Shield, title: 'Tarnish-Free', desc: '18K gold plating over surgical grade stainless steel.' },
  { icon: Heart, title: 'Hypoallergenic', desc: 'No copper. No brass. No lead. Safe for sensitive skin.' },
  { icon: Award, title: '2 Year Warranty', desc: 'If anything goes wrong, we have you covered.' },
];

const QualityPromise = () => (
  <section className="container mx-auto px-4 py-20">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          The AURUM <span className="text-gradient-gold">Quality Promise</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto font-body text-muted-foreground text-lg leading-relaxed">
          Every piece is built to be worn on repeat — not saved for "someday." Our 18K gold plating is layered over surgical grade stainless steel with PVD coating. Gold that stays gold.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center p-6 rounded-2xl bg-secondary border border-border"
          >
            <f.icon className="mx-auto h-8 w-8 text-primary mb-3" />
            <h3 className="font-display text-lg font-bold text-foreground">{f.title}</h3>
            <p className="font-body text-sm text-muted-foreground mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default QualityPromise;
