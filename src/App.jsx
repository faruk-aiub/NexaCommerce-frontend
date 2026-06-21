import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppRoutes } from './routes/AppRoutes';
import { fetchProfile } from './redux/slices/authSlice';
import { fetchCart } from './redux/slices/cartSlice';
import { fetchWishlist } from './redux/slices/wishlistSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Load local guest state or query authenticated states
    dispatch(fetchCart());
    dispatch(fetchWishlist());

    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);

  return <AppRoutes />;
}

export default App;
