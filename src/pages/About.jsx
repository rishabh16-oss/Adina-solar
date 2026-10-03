import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function About() {
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
      console.error('Error loading site settings:', error);
      return;
    }

    setSettings(data);
  };
  return (
    <main className="inner-page">
      <section className="page-hero">
        <p className="section-label">ABOUT ADINA</p>
        <h1>Powering a Cleaner Future</h1>
        <p>
          We provide reliable and sustainable solar energy solutions for homes,
          businesses and industries.
        </p>
      </section>

      <section className="about-page">
        <div className="about-page-image">
          <img
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80"
            alt="Solar panels"
          />
        </div>

        <div>
          <p className="section-label">WHO WE ARE</p>

          <h2>
            Your Partner in
            <span> Solar Energy</span>
          </h2>

          <p>
            {settings?.description ||
              'Adina Solar Solutions is committed to helping homes, businesses and industries switch to clean and reliable solar energy.'}
          </p>

          <p>
            Our goal is simple — help our customers reduce energy costs while
            contributing to a cleaner environment.
          </p>
        </div>
      </section>

      <section className="mission-section">
        <div className="mission-card">
          <div className="mission-icon">◎</div>
          <h3>Our Mission</h3>
          <p>
            To make clean and affordable solar energy accessible to more homes
            and businesses.
          </p>
        </div>

        <div className="mission-card">
          <div className="mission-icon">◇</div>
          <h3>Our Vision</h3>
          <p>
            To create a sustainable future powered by clean, reliable and
            renewable energy.
          </p>
        </div>

        <div className="mission-card">
          <div className="mission-icon">✓</div>
          <h3>Our Values</h3>
          <p>
            Quality, transparency, reliability and customer satisfaction are at
            the heart of our work.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;
