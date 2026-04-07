import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart-store';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, totalPrice } = useCartStore();
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <ShoppingBag className="h-16 w-16 opacity-30" />
            <p className="font-body">Your cart is empty</p>
            <Button variant="outline" onClick={() => { setCartOpen(false); navigate('/shop'); }}>
              Browse Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-primary font-semibold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-body text-lg">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-primary">${totalPrice().toFixed(2)}</span>
              </div>
              <Button className="w-full bg-gradient-gold text-primary-foreground font-body font-semibold hover:opacity-90" size="lg">
                Checkout — ${totalPrice().toFixed(2)}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
