import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('greenfresh_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('greenfresh_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('greenfresh_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('greenfresh_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === (product._id || product.id));
      const priceToUse = product.discountPrice || product.price;

      if (existing) {
        return prev.map(item =>
          item.productId === (product._id || product.id)
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * priceToUse }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: product._id || product.id,
            name: product.name,
            image: product.image,
            price: priceToUse,
            originalPrice: product.price,
            unit: product.unit || '500g',
            quantity,
            total: priceToUse * quantity
          }
        ];
      }
    });

    showToast(`Added ${product.name} to cart!`);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQty, total: newQty * item.price }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    const exists = wishlist.some(item => (item._id || item.id) === id);

    if (exists) {
      setWishlist(prev => prev.filter(item => (item._id || item.id) !== id));
      showToast('Removed from your wishlist', 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      showToast('Added to your wishlist!');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item.id) === productId);
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GREEN10' || cleanCode === 'FRESH10') {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      showToast('Coupon applied: 10% OFF discount!');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'WELCOME20') {
      setPromoCode(cleanCode);
      setDiscountPercent(20);
      showToast('Welcome coupon: 20% OFF applied!');
      return { success: true, message: '20% discount applied!' };
    } else {
      showToast('Invalid promo code', 'error');
      return { success: false, message: 'Invalid promo code. Try "GREEN10"' };
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscountPercent(0);
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryThreshold = 350; // free delivery above ₹350
  const deliveryFee = subtotal === 0 || subtotal >= deliveryThreshold ? 0 : 40;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const value = {
    cartItems,
    cartCount,
    wishlist,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    openCartDrawer: () => setIsCartDrawerOpen(true),
    closeCartDrawer: () => setIsCartDrawerOpen(false),
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    subtotal,
    deliveryFee,
    deliveryThreshold,
    promoCode,
    discountPercent,
    discountAmount,
    grandTotal,
    applyPromo,
    removePromo,
    toast,
    showToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

