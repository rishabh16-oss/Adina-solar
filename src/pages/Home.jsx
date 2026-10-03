import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Home() {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchSettings();
    fetchServices();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error loading site settings:', error);
      return;
    }

    setSettings(data);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading services:', error);
      return;
    }

    setServices(data);
  };

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from('achievement_stats')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading statistics:', error);
      return;
    }

    setStats(data);
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section
        className="hero"
        style={
          settings?.hero_image_url
            ? {
                backgroundImage: `url(${settings.hero_image_url})`,
              }
            : {}
        }
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="hero-tag">CLEAN ENERGY • BRIGHTER FUTURE</p>

          <h1>
            {settings?.hero_title || 'Power Your Future'}
            <span> With Solar Energy</span>
          </h1>

          <p className="hero-description">
            {settings?.hero_subtitle ||
              'Reliable, affordable and sustainable solar energy solutions for homes and businesses.'}
          </p>

          <div className="hero-buttons">
            <a href="/contact" className="primary-button">
              Contact Us →
            </a>

            <a href="/projects" className="secondary-button">
              Explore Our Projects
            </a>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        {stats.map((stat) => (
          <div className="stat" key={stat.id}>
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ABOUT PREVIEW */}
      <section className="about-preview">
        <div className="about-image">
          <div className="image-placeholder">☀</div>
        </div>

        <div className="about-content">
          <p className="section-label">ABOUT ADINA</p>

          <h2>
            Building a Cleaner
            <span> Tomorrow</span>
          </h2>

          <p>
            Adina Solar Solutions is committed to helping homes, businesses and
            industries switch to clean and reliable solar energy.
          </p>

          <p>
            From consultation and installation to maintenance, we provide
            complete solar solutions designed around our customers' needs.
          </p>

          <a href="/about" className="text-button">
            Discover More →
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-preview">
        <div className="section-heading">
          <p className="section-label">WHAT WE DO</p>

          <h2>Our Solar Solutions</h2>

          <p>
            Complete solar solutions for residential, commercial and industrial
            requirements.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <div className="service-card" key={service.id}>
              <div className="service-icon">{service.icon || '☀'}</div>

              <h3>{service.title}</h3>

              <p>{service.short_description}</p>

              <a href="/services">Learn More →</a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div>
          <p className="section-label">MAKE THE SWITCH TODAY</p>

          <h2>Ready to Go Solar?</h2>

          <p>Let's build a cleaner and more sustainable future together.</p>
        </div>

        <a href="/contact" className="primary-button">
          Contact Us →
        </a>
      </section>
    </main>
  );
}

export default Home;
