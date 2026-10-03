import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function Contact() {
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

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Residential Solar',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess('');
    setError('');

    const { error } = await supabase.from('enquiries').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      service: form.service,
      message: form.message,
    });

    setLoading(false);

    if (error) {
      console.error('Error submitting enquiry:', error);

      setError(`Error: ${error.message}`);

      return;
    }

    setSuccess('Thank you! Your enquiry has been submitted successfully.');

    setForm({
      name: '',
      phone: '',
      email: '',
      service: 'Residential Solar',
      message: '',
    });
  };

  return (
    <main className="inner-page">
      {/* HERO */}
      <section className="page-hero">
        <p className="section-label">GET IN TOUCH</p>

        <h1>Let's Talk Solar</h1>

        <p>
          Have a question or want to install solar? We'd love to hear from you.
        </p>
      </section>

      {/* CONTACT */}
      <section className="contact-page">
        <div className="contact-info">
          <p className="section-label">CONTACT ADINA</p>

          <h2>
            Start Your Solar
            <span> Journey Today</span>
          </h2>

          <p>
            Tell us about your requirements and our team will help you find the
            right solar solution.
          </p>

          <div className="contact-item">
            <div>📞</div>

            <div>
              <h3>Phone</h3>
              <p>{settings?.phone || '+91 XXXXX XXXXX'}</p>
            </div>
          </div>

          <div className="contact-item">
            <div>✉</div>

            <div>
              <h3>Email</h3>
              <p>{settings?.email || 'info@adinasolar.com'}</p>
            </div>
          </div>

          <div className="contact-item">
            <div>📍</div>

            <div>
              <h3>Location</h3>
              <p>{settings?.address || 'India'}</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Your Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Interested In</label>

          <select name="service" value={form.service} onChange={handleChange}>
            <option>Residential Solar</option>
            <option>Commercial Solar</option>
            <option>Industrial Solar</option>
            <option>Solar Maintenance</option>
            <option>Other</option>
          </select>

          <label>Message</label>

          <textarea
            name="message"
            rows="6"
            placeholder="Tell us about your requirements..."
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>

          {/* SUCCESS MESSAGE */}

          {success && <p className="contact-success">{success}</p>}

          {/* ERROR MESSAGE */}

          {error && <p className="contact-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Enquiry →'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Contact;
