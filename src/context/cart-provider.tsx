'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type CartItem, type Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.availableQuantity) {
            toast({
                title: "Stock limit reached",
                description: `You cannot add more of ${product.name} to the cart.`,
                variant: "destructive"
            });
            return prevItems;
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      if (product.availableQuantity < 1) {
        toast({
            title: "Out of stock",
            description: `${product.name} is currently out of stock.`,
            variant: "destructive"
        });
        return prevItems;
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const productInCart = cartItems.find(item => item.id === productId);
    if (productInCart && quantity > productInCart.availableQuantity) {
        toast({
            title: "Stock limit reached",
            description: `Only ${productInCart.availableQuantity} of ${productInCart.name} available.`,
            variant: "destructive"
        });
        return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}
