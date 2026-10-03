import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';

import Login from './pages/Login';
import Admin from './pages/Admin';
import ProjectsAdmin from './pages/ProjectsAdmin';
import ServicesAdmin from './pages/ServicesAdmin';
import AchievementsAdmin from './pages/AchievementsAdmin';
import EnquiriesAdmin from './pages/EnquiriesAdmin';
import SiteSettingsAdmin from './pages/SiteSettingsAdmin';
import AchievementStatsAdmin from './pages/AchievementStatsAdmin';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/achievements" element={<Achievements />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/projects" element={<ProjectsAdmin />} />
        <Route path="/admin/services" element={<ServicesAdmin />} />
        <Route path="/admin/achievements" element={<AchievementsAdmin />} />
        <Route path="/admin/enquiries" element={<EnquiriesAdmin />} />
        <Route path="/admin/settings" element={<SiteSettingsAdmin />} />
        <Route
          path="/admin/achievement-stats"
          element={<AchievementStatsAdmin />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
