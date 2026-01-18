import { useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, DataContext } from './context/DataContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGuard from './components/AdminGuard';

function FaviconUpdater() {
  const { content } = useContext(DataContext);
  
  useEffect(() => {
    if (content?.favicon) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = content.favicon;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = content.favicon;
        document.head.appendChild(newLink);
      }
    }
  }, [content?.favicon]);

  return null;
}

function App() {
  return (
    <DataProvider>
      <FaviconUpdater />
      <Router>
        <div className="font-sans text-white min-h-screen selection:bg-emerald-500 selection:text-white transition-colors duration-300 relative">
          {/* Global Fixed Background */}
          <div 
             className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
             style={{ 
               backgroundImage: 'url("https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop")',
               backgroundAttachment: 'fixed' // Ensures compatibility if browser supports it
             }}
          />
          {/* Global Overlay for readability */}
          <div className="fixed inset-0 z-[-1] bg-black/50 backdrop-blur-[2px]" />

          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage category="general" title="General Events" />} />
            <Route path="/campus-activities" element={<EventsPage category="campus" title="Campus Activities" />} />
            <Route path="/field-visits" element={<EventsPage category="visit" title="Field Visits" />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
