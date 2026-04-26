import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);
  
  const add = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  
  return { toasts, add };
}