import { Route, Routes } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import SetupNotice from './components/SetupNotice';
import { isSupabaseConfigured } from './lib/supabaseClient';
import Home from './pages/Home';
import Results from './pages/Results';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';

export default function App() {
  // Without the two env variables the Supabase client cannot be created.
  // Show a clear setup screen instead of a blank white page.
  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hotels" element={<Results />} />
          <Route path="hotels/:slug" element={<HotelDetails />} />
          <Route
            path="book"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="confirmation/:reference"
            element={
              <ProtectedRoute>
                <Confirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route path="auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
