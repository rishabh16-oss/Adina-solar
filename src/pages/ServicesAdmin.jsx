import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    short_description: '',
    description: '',
    icon: '',
    image_url: '',
    is_active: true,
    display_order: 0,
  });

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
      return;
    }

    setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: '',
      short_description: '',
      description: '',
      icon: '',
      image_url: '',
      is_active: true,
      display_order: 0,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    const serviceData = {
      title: form.title,
      short_description: form.short_description,
      description: form.description,
      icon: form.icon,
      image_url: form.image_url,
      is_active: form.is_active,
      display_order: Number(form.display_order) || 0,
    };

    let error;

    if (editingId) {
      const result = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingId);

      error = result.error;
    } else {
      const result = await supabase.from('services').insert([serviceData]);

      error = result.error;
    }

    setSaving(false);

    if (error) {
      console.error('Service save error:', error);
      alert(error.message);
      return;
    }

    alert(editingId ? 'Service updated!' : 'Service added!');

    resetForm();
    fetchServices();
  };

  // Edit
  const handleEdit = (service) => {
    setForm({
      title: service.title || '',
      short_description: service.short_description || '',
      description: service.description || '',
      icon: service.icon || '',
      image_url: service.image_url || '',
      is_active: service.is_active,
      display_order: service.display_order || 0,
    });

    setEditingId(service.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this service?'
    );

    if (!confirmed) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      alert(error.message);
      return;
    }

    fetchServices();
  };

  // Activate / Deactivate
  const toggleActive = async (service) => {
    const { error } = await supabase
      .from('services')
      .update({
        is_active: !service.is_active,
      })
      .eq('id', service.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchServices();
  };

  return (
    <div className="services-admin">
      {/* HEADER */}
      <div className="services-admin-header">
        <div>
          <h1>Manage Services</h1>
          <p>
            Add and manage the solar services offered by Adina Solar Solutions.
          </p>
        </div>

        <button
          className="add-service-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Service
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <section className="service-form-card">
          <h2>{editingId ? 'Edit Service' : 'Add New Service'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="service-form-grid">
              {/* TITLE */}
              <div className="form-group">
                <label>Service Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Residential Solar"
                  required
                />
              </div>

              {/* ICON */}
              <div className="form-group">
                <label>Icon</label>

                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="☀️"
                />
              </div>

              {/* SHORT DESCRIPTION */}
              <div className="form-group">
                <label>Short Description</label>

                <input
                  type="text"
                  name="short_description"
                  value={form.short_description}
                  onChange={handleChange}
                  placeholder="Solar solutions for homes"
                />
              </div>

              {/* DISPLAY ORDER */}
              <div className="form-group">
                <label>Display Order</label>

                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Full Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe this service..."
                rows="5"
              />
            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label>Image URL</label>

              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* ACTIVE */}
            <label className="active-checkbox">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              Show this service on the website
            </label>

            {/* ACTIONS */}
            <div className="form-actions">
              <button
                type="submit"
                className="save-service-btn"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                  ? 'Update Service'
                  : 'Add Service'}
              </button>

              <button
                type="button"
                className="cancel-service-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SERVICE LIST */}
      <section className="services-list">
        <h2>Existing Services</h2>

        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <div className="service-admin-grid">
            {services.map((service) => (
              <div className="service-admin-card" key={service.id}>
                {service.image_url && (
                  <img src={service.image_url} alt={service.title} />
                )}

                <div className="service-admin-card-content">
                  <div className="service-status">
                    {service.is_active ? 'Active' : 'Inactive'}
                  </div>

                  <h3>
                    {service.icon && `${service.icon} `}
                    {service.title}
                  </h3>

                  <p>{service.short_description}</p>

                  <div className="service-card-actions">
                    <button onClick={() => handleEdit(service)}>Edit</button>

                    <button onClick={() => toggleActive(service)}>
                      {service.is_active ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ServicesAdmin;
