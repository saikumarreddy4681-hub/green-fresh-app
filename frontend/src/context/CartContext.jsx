import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const DEFAULT_ADDRESSES = [
  {
    id: 'addr-home',
    type: 'Home',
    tag: 'Home',
    address: 'Flat 402, Green Glen Layout, Outer Ring Road, Bellandur, Bengaluru - 560103',
    timeEstimate: '12 mins'
  },
  {
    id: 'addr-work',
    type: 'Work',
    tag: 'Work',
    address: 'Tower B, 4th Floor, Manyata Embassy Business Park, Bengaluru - 560045',
    timeEstimate: '15 mins'
  },
  {
    id: 'addr-other',
    type: 'Other',
    tag: 'Other',
    address: 'Indiranagar 100ft Road, Near Metro Station, Bengaluru - 560038',
    timeEstimate: '10 mins'
  }
];

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

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('greenfresh_recently_viewed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('greenfresh_addresses');
      return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const stored = localStorage.getItem('greenfresh_selected_address');
      return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES[0];
    } catch {
      return DEFAULT_ADDRESSES[0];
    }
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
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

  useEffect(() => {
    localStorage.setItem('greenfresh_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('greenfresh_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  useEffect(() => {
    localStorage.setItem('greenfresh_selected_address', JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const addToCart = (product, quantity = 1) => {
    const id = product._id || product.id;
    const priceToUse = product.discountPrice || product.price;

    setCartItems(prev => {
      const existing = prev.find(item => item.productId === id);
      if (existing) {
        return prev.map(item =>
          item.productId === id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * priceToUse }
            : item
        );
      } else {
        return [
          ...prev,
          {
            productId: id,
            name: product.name,
            image: product.image,
            price: priceToUse,
            originalPrice: product.price,
            unit: product.unit || '1 unit',
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

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    return item ? item.quantity : 0;
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
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      showToast('Saved to wishlist!');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item.id) === productId);
  };

  const addRecentlyViewed = (product) => {
    if (!product) return;
    const id = product._id || product.id;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => (p._id || p.id) !== id);
      return [product, ...filtered].slice(0, 12);
    });
  };

  const applyPromo = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GREEN10' || cleanCode === 'FRESH10' || cleanCode === 'BLINKIT') {
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
  const originalSubtotal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
  const savings = Math.max(0, originalSubtotal - subtotal);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryThreshold = 350; // free delivery above ₹350
  const deliveryFee = subtotal === 0 || subtotal >= deliveryThreshold ? 0 : 30;
  const handlingFee = subtotal > 0 ? 4 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + handlingFee);

  const value = {
    cartItems,
    wishlist,
    recentlyViewed,
    addRecentlyViewed,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    openCartDrawer: () => setIsCartDrawerOpen(true),
    closeCartDrawer: () => setIsCartDrawerOpen(false),
    selectedAddress,
    setSelectedAddress,
    savedAddresses,
    setSavedAddresses,
    isLocationModalOpen,
    setIsLocationModalOpen,
    addToCart,
    updateQuantity,
    getItemQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isInWishlist,
    promoCode,
    discountPercent,
    applyPromo,
    removePromo,
    cartCount,
    subtotal,
    originalSubtotal,
    savings,
    discountAmount,
    deliveryThreshold,
    deliveryFee,
    handlingFee,
    grandTotal,
    toast,
    showToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
