import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function SiteSettingsAdmin() {
  const [settings, setSettings] = useState({
    company_name: '',
    tagline: '',
    description: '',

    phone: '',
    email: '',
    whatsapp: '',

    address: '',
    city: '',
    state: '',
    country: 'India',

    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',

    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    youtube_url: '',
  });

  const [seoSettings, setSeoSettings] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    robots_meta: 'index, follow',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchSeoSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching site settings:', error);
      setError(error.message);
    } else if (data) {
      setSettings({
        company_name: data.company_name || '',
        tagline: data.tagline || '',
        description: data.description || '',

        phone: data.phone || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',

        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India',

        hero_title: data.hero_title || '',
        hero_subtitle: data.hero_subtitle || '',
        hero_image_url: data.hero_image_url || '',

        facebook_url: data.facebook_url || '',
        instagram_url: data.instagram_url || '',
        linkedin_url: data.linkedin_url || '',
        youtube_url: data.youtube_url || '',
      });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const fetchSeoSettings = async () => {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error loading SEO settings:', error);
      return;
    }

    setSeoSettings(data);
  };
  const handleSeoChange = (e) => {
    const { name, value } = e.target;

    setSeoSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSeoSettings = async () => {
    const { error } = await supabase
      .from('seo_settings')
      .update({
        seo_title: seoSettings.seo_title,
        seo_description: seoSettings.seo_description,
        seo_keywords: seoSettings.seo_keywords,
        og_title: seoSettings.og_title,
        og_description: seoSettings.og_description,
        og_image_url: seoSettings.og_image_url,
        canonical_url: seoSettings.canonical_url,
        robots_meta: seoSettings.robots_meta,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    if (error) {
      console.error('Error saving SEO settings:', error);
      alert('Failed to save SEO settings');
      return;
    }

    alert('SEO settings saved successfully!');
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    const { error } = await supabase
      .from('site_settings')
      .update({
        company_name: settings.company_name,
        tagline: settings.tagline,
        description: settings.description,

        phone: settings.phone,
        email: settings.email,
        whatsapp: settings.whatsapp,

        address: settings.address,
        city: settings.city,
        state: settings.state,
        country: settings.country,

        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_image_url: settings.hero_image_url,

        facebook_url: settings.facebook_url,
        instagram_url: settings.instagram_url,
        linkedin_url: settings.linkedin_url,
        youtube_url: settings.youtube_url,
      })
      .eq('id', 1);

    setSaving(false);

    if (error) {
      console.error('Error saving site settings:', error);
      setError(error.message);
      return;
    }

    setMessage('Site settings saved successfully!');
  };

  if (loading) {
    return (
      <main className="site-settings-admin">
        <p className="settings-status">Loading site settings...</p>
      </main>
    );
  }

  return (
    <main className="site-settings-admin">
      <div className="settings-header">
        <div>
          <p className="section-label">ADMIN PANEL</p>
          <h1>Site Settings</h1>
          <p>
            Manage the information displayed throughout the Adina Solar
            Solutions website.
          </p>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        {/* COMPANY INFORMATION */}

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Company Information</h2>
            <p>Basic information about Adina Solar Solutions.</p>
          </div>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Company Name</label>

              <input
                type="text"
                name="company_name"
                value={settings.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="settings-field">
              <label>Tagline</label>

              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field full-width">
              <label>Description</label>

              <textarea
                name="description"
                rows="5"
                value={settings.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* CONTACT INFORMATION */}

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Contact Information</h2>
            <p>These details will be used on the public website.</p>
          </div>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="settings-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="info@adinasolar.com"
              />
            </div>

            <div className="settings-field">
              <label>WhatsApp</label>

              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="settings-field">
              <label>Country</label>

              <input
                type="text"
                name="country"
                value={settings.country}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field full-width">
              <label>Address</label>

              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>City</label>

              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={settings.state}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* HERO SETTINGS */}

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Homepage Hero</h2>
            <p>Control the main heading and image shown on the homepage.</p>
          </div>

          <div className="settings-grid">
            <div className="settings-field full-width">
              <label>Hero Title</label>

              <input
                type="text"
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field full-width">
              <label>Hero Subtitle</label>

              <textarea
                name="hero_subtitle"
                rows="4"
                value={settings.hero_subtitle}
                onChange={handleChange}
              />
            </div>

            <div className="settings-field full-width">
              <label>Hero Image URL</label>

              <input
                type="url"
                name="hero_image_url"
                value={settings.hero_image_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* SOCIAL MEDIA */}

        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Social Media</h2>
            <p>Add links to your company's social media profiles.</p>
          </div>

          <div className="settings-grid">
            <div className="settings-field">
              <label>Facebook</label>

              <input
                type="url"
                name="facebook_url"
                value={settings.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="settings-field">
              <label>Instagram</label>

              <input
                type="url"
                name="instagram_url"
                value={settings.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="settings-field">
              <label>LinkedIn</label>

              <input
                type="url"
                name="linkedin_url"
                value={settings.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div className="settings-field">
              <label>YouTube</label>

              <input
                type="url"
                name="youtube_url"
                value={settings.youtube_url}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </section>

        <div className="settings-section">
          <div className="settings-section-header">
            <h2>SEO Settings</h2>
            <p>
              Configure how Adina Solar Solutions appears in search engines and
              when your website is shared on social media.
            </p>
          </div>

          <div className="settings-grid">
            <div className="settings-field">
              <label>SEO Title</label>

              <input
                type="text"
                name="seo_title"
                value={seoSettings.seo_title || ''}
                onChange={handleSeoChange}
                placeholder="Adina Solar Solutions | Solar Energy Solutions"
              />
            </div>

            <div className="settings-field">
              <label>SEO Description</label>

              <textarea
                name="seo_description"
                value={seoSettings.seo_description || ''}
                onChange={handleSeoChange}
                placeholder="Reliable solar energy solutions for homes, businesses and industries."
                rows="4"
              />
            </div>

            <div className="settings-field">
              <label>SEO Keywords</label>

              <input
                type="text"
                name="seo_keywords"
                value={seoSettings.seo_keywords || ''}
                onChange={handleSeoChange}
                placeholder="solar panels, solar energy, rooftop solar"
              />
            </div>

            <div className="settings-field">
              <label>Robots Meta</label>

              <select
                name="robots_meta"
                value={seoSettings.robots_meta || 'index, follow'}
                onChange={handleSeoChange}
              >
                <option value="index, follow">index, follow</option>

                <option value="noindex, nofollow">noindex, nofollow</option>

                <option value="index, nofollow">index, nofollow</option>

                <option value="noindex, follow">noindex, follow</option>
              </select>
            </div>

            <div className="settings-field">
              <label>Open Graph Title</label>

              <input
                type="text"
                name="og_title"
                value={seoSettings.og_title || ''}
                onChange={handleSeoChange}
                placeholder="Adina Solar Solutions"
              />
            </div>

            <div className="settings-field">
              <label>Open Graph Description</label>

              <textarea
                name="og_description"
                value={seoSettings.og_description || ''}
                onChange={handleSeoChange}
                placeholder="Discover reliable solar energy solutions from Adina Solar Solutions."
                rows="4"
              />
            </div>

            <div className="settings-field">
              <label>Open Graph Image URL</label>

              <input
                type="url"
                name="og_image_url"
                value={seoSettings.og_image_url || ''}
                onChange={handleSeoChange}
                placeholder="https://example.com/solar-image.jpg"
              />
            </div>

            <div className="settings-field">
              <label>Canonical URL</label>

              <input
                type="url"
                name="canonical_url"
                value={seoSettings.canonical_url || ''}
                onChange={handleSeoChange}
                placeholder="https://www.adinasolar.com"
              />
            </div>
          </div>

          <button
            type="button"
            className="settings-save-button"
            onClick={saveSeoSettings}
          >
            Save SEO Settings
          </button>
        </div>

        {/* MESSAGES */}

        {message && <p className="settings-success">{message}</p>}

        {error && <p className="settings-error">Error: {error}</p>}

        <div className="settings-save-area">
          <button
            type="submit"
            className="settings-save-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default SiteSettingsAdmin;
