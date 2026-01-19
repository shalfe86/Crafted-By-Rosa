import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../context/CartContext';

const TrafficTracker: React.FC = () => {
  const location = useLocation();
  const { guestId } = useCart();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Prevent duplicate logging for the same path (e.g. React StrictMode or re-renders)
    // Only log if path changes
    if (!guestId || lastPathRef.current === location.pathname) return;

    const logTraffic = async () => {
       lastPathRef.current = location.pathname;
       try {
           await supabase.from('site_traffic').insert({
              page_path: location.pathname,
              guest_id: guestId
           });
       } catch (err) {
           console.error("Traffic log failed", err);
       }
    };

    logTraffic();
  }, [location.pathname, guestId]);

  return null;
};

export default TrafficTracker;
