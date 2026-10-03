import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error loading footer settings:', error);
      return;
    }

    setSettings(data);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company */}
        <div className="footer-column footer-about">
          <h2>{settings?.company_name || 'Adina Solar Solutions'}</h2>

          <p>
            {settings?.tagline ||
              'Powering a cleaner future with solar energy.'}
          </p>

          <p className="footer-location">
            ☀️ Sustainable Energy • Smarter Future
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/achievements">Achievements</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h3>Our Services</h3>

          <Link to="/services">Residential Solar</Link>
          <Link to="/services">Commercial Solar</Link>
          <Link to="/services">Industrial Solar</Link>
          <Link to="/services">Solar Maintenance</Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>{settings?.address || 'India'}</p>
          <p>{settings?.phone || '+91 XXXXX XXXXX'}</p>
          <p>{settings?.email || 'info@adinasolar.com'}</p>

          <Link to="/contact" className="footer-button">
            Get a Quote
          </Link>
        </div>
      </div>

      <div className="footer-column footer-social">
        <h3>Follow Us</h3>

        <div className="social-links">
          {settings?.facebook_url && (
            <a
              href={settings.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              Facebook
            </a>
          )}

          {settings?.instagram_url && (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              Instagram
            </a>
          )}

          {settings?.linkedin_url && (
            <a
              href={settings.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          )}

          {settings?.youtube_url && (
            <a
              href={settings.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              YouTube
            </a>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Adina Solar Solutions. All Rights
          Reserved.
        </p>

        <p>Clean Energy • Better Future ☀️</p>
      </div>
    </footer>
  );
}

export default Footer;
