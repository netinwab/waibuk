import { createContext, useContext, useState, useEffect } from 'react';
import { getUSDToNGNRate } from '@/lib/utils';

export type Currency = 'USD' | 'NGN';

interface CurrencyContextType {
  userCurrency: Currency;
  exchangeRate: number;
  setUserCurrency: (currency: Currency) => void;
  convertPrice: (usdAmount: number) => number;
  formatPrice: (amount: number, currency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [userCurrency, setUserCurrency] = useState<Currency>('USD'); // Default to USD
  const [exchangeRate, setExchangeRate] = useState<number>(1650); // Default fallback rate

  // Fetch exchange rate when component mounts or when needed for NGN display
  useEffect(() => {
    getUSDToNGNRate().then(rate => {
      setExchangeRate(rate);
    });
  }, []);

  // Load user's currency preference from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency;
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'NGN')) {
      setUserCurrency(savedCurrency);
    }
  }, []);

  const handleSetUserCurrency = (currency: Currency) => {
    setUserCurrency(currency);
    localStorage.setItem('preferredCurrency', currency);
  };

  const convertPrice = (usdAmount: number): number => {
    // Base currency is USD, convert to NGN for display if needed
    if (userCurrency === 'NGN') {
      return usdAmount * exchangeRate;
    }
    return usdAmount; // Return USD amount as-is
  };

  const formatPrice = (amount: number, currency?: Currency): string => {
    const targetCurrency = currency || userCurrency;
    
    if (targetCurrency === 'NGN') {
      return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        userCurrency,
        exchangeRate,
        setUserCurrency: handleSetUserCurrency,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}