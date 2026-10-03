import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      setError('Unable to load services.');
    } else {
      setServices(data);
    }

    setLoading(false);
  };

  return (
    <main className="inner-page">
      {/* Page Hero */}
      <section className="page-hero">
        <p className="section-label">WHAT WE OFFER</p>

        <h1>Our Solar Services</h1>

        <p>
          Complete solar solutions designed around your energy requirements.
        </p>
      </section>

      {/* Services Section */}
      <section className="services-page">
        <div className="section-heading">
          <p className="section-label">OUR EXPERTISE</p>

          <h2>Solutions for Every Energy Need</h2>

          <p>
            From small residential installations to large industrial projects,
            we provide end-to-end solar services.
          </p>
        </div>

        {/* Loading */}
        {loading && <p className="services-status">Loading services...</p>}

        {/* Error */}
        {error && <p className="services-status">{error}</p>}

        {/* Services */}
        {!loading && !error && (
          <div className="service-page-grid">
            {services.map((service) => (
              <div className="large-service-card" key={service.id}>
                <div className="service-icon">{service.icon}</div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

                <a href="/contact">Get Started →</a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Services;
