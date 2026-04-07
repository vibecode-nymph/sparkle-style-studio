export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export const reviews: Record<string, Review[]> = {
  '1': [
    { id: 'r1', author: 'Marcus T.', rating: 5, date: '2026-03-12', text: 'Absolutely love this chain. Heavy, solid, and the gold plating is incredible. Wore it in the shower — still perfect.', verified: true },
    { id: 'r2', author: 'Jasmine K.', rating: 5, date: '2026-02-28', text: 'Got this as a gift for my boyfriend and he hasn\'t taken it off since. Great quality for the price.', verified: true },
    { id: 'r3', author: 'Derek L.', rating: 4, date: '2026-02-15', text: 'Really nice weight and shine. Wish it came in a 26" option but the 24" works great.', verified: true },
    { id: 'r4', author: 'Aisha M.', rating: 5, date: '2026-01-30', text: 'Second purchase from AURUM. The Cuban link is a statement piece — gets compliments every time.', verified: true },
  ],
  '2': [
    { id: 'r5', author: 'Tyler R.', rating: 5, date: '2026-03-05', text: 'The twist on this rope chain catches light beautifully. Perfect for layering.', verified: true },
    { id: 'r6', author: 'Nina S.', rating: 4, date: '2026-02-20', text: 'Beautiful chain, looks even better in person. Shipping was fast too.', verified: true },
    { id: 'r7', author: 'Chris W.', rating: 5, date: '2026-01-18', text: 'Wore it to a wedding and got so many compliments. Sterling silver quality is top notch.', verified: true },
  ],
  '3': [
    { id: 'r8', author: 'Elena P.', rating: 5, date: '2026-03-18', text: 'The Figaro pattern is gorgeous. Feels luxurious without the luxury price tag.', verified: true },
    { id: 'r9', author: 'Jordan H.', rating: 5, date: '2026-02-10', text: 'My go-to daily chain now. The alternating links are such a classic look.', verified: true },
  ],
  '4': [
    { id: 'r10', author: 'Sam D.', rating: 4, date: '2026-03-22', text: 'Clean, minimal, exactly what I wanted. The box links are perfectly geometric.', verified: true },
    { id: 'r11', author: 'Priya N.', rating: 5, date: '2026-02-05', text: 'Sleek and understated. Perfect foundation piece to build a stack on.', verified: true },
  ],
  '5': [
    { id: 'r12', author: 'Mia C.', rating: 5, date: '2026-03-15', text: 'This cuff is BOLD. Love the hammered finish — it feels like a piece of art.', verified: true },
    { id: 'r13', author: 'Liam O.', rating: 4, date: '2026-02-22', text: 'Great adjustable fit. The gold plating is rich and warm.', verified: true },
    { id: 'r14', author: 'Sofia G.', rating: 5, date: '2026-01-28', text: 'Stacked it with my tennis bracelet and it looks amazing together.', verified: true },
  ],
  '6': [
    { id: 'r15', author: 'Ava B.', rating: 5, date: '2026-03-20', text: 'Sparkles like crazy! The CZ stones catch every bit of light. Red carpet vibes.', verified: true },
    { id: 'r16', author: 'Noah J.', rating: 5, date: '2026-03-01', text: 'Bought this for my mom and she absolutely loves it. Premium quality.', verified: true },
    { id: 'r17', author: 'Emma F.', rating: 4, date: '2026-02-14', text: 'Beautiful bracelet. The clasp is secure and the stones are brilliant.', verified: true },
  ],
  '7': [
    { id: 'r18', author: 'Lucas M.', rating: 5, date: '2026-03-08', text: 'Heavy and luxurious. The toggle clasp is a nice touch. Unapologetically bold!', verified: true },
    { id: 'r19', author: 'Zoe A.', rating: 4, date: '2026-02-18', text: 'Love the oversized links. Makes a statement without trying too hard.', verified: true },
  ],
  '8': [
    { id: 'r20', author: 'Oliver K.', rating: 5, date: '2026-03-25', text: 'Liquid gold is the perfect description. Lays flat and looks incredible.', verified: true },
    { id: 'r21', author: 'Isabella R.', rating: 5, date: '2026-03-10', text: 'The herringbone style is so elegant. This is my everyday chain now.', verified: true },
    { id: 'r22', author: 'Ethan W.', rating: 4, date: '2026-02-25', text: 'Smooth, sleek, and the 14K plating has held up great so far.', verified: true },
  ],
};

export function getProductReviews(productId: string): Review[] {
  return reviews[productId] || [];
}

export function getAverageRating(productId: string): number {
  const r = reviews[productId];
  if (!r || r.length === 0) return 0;
  return r.reduce((sum, rev) => sum + rev.rating, 0) / r.length;
}
