import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function AchievementStatsAdmin() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    value: '',
    label: '',
    display_order: 0,
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('achievement_stats')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
      return;
    }

    setStats(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      value: '',
      label: '',
      display_order: 0,
      is_active: true,
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.value || !form.label) {
      alert('Please enter both value and label.');
      return;
    }

    const statData = {
      value: form.value,
      label: form.label,
      display_order: Number(form.display_order),
      is_active: form.is_active,
    };

    let error;

    if (editingId) {
      const result = await supabase
        .from('achievement_stats')
        .update(statData)
        .eq('id', editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from('achievement_stats')
        .insert([statData]);

      error = result.error;
    }

    if (error) {
      console.error('Error saving statistic:', error);
      alert(error.message);
      return;
    }

    resetForm();
    fetchStats();
  };

  const handleEdit = (stat) => {
    setEditingId(stat.id);

    setForm({
      value: stat.value,
      label: stat.label,
      display_order: stat.display_order,
      is_active: stat.is_active,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this statistic?'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('achievement_stats')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting statistic:', error);
      alert(error.message);
      return;
    }

    fetchStats();
  };

  const toggleActive = async (stat) => {
    const { error } = await supabase
      .from('achievement_stats')
      .update({
        is_active: !stat.is_active,
      })
      .eq('id', stat.id);

    if (error) {
      console.error('Error updating statistic:', error);
      alert(error.message);
      return;
    }

    fetchStats();
  };

  return (
    <main className="achievement-stats-admin">
      <div className="admin-page-header">
        <div>
          <p className="section-label">ADMIN PANEL</p>
          <h1>Achievement Statistics</h1>
          <p>Manage the statistics displayed on the Home page.</p>
        </div>
      </div>

      {/* FORM */}
      <section className="admin-form-card">
        <h2>{editingId ? 'Edit Statistic' : 'Add Statistic'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label>Value</label>
              <input
                type="text"
                name="value"
                value={form.value}
                onChange={handleChange}
                placeholder="500+"
              />
            </div>

            <div className="admin-form-field">
              <label>Label</label>
              <input
                type="text"
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Projects Completed"
              />
            </div>

            <div className="admin-form-field">
              <label>Display Order</label>
              <input
                type="number"
                name="display_order"
                value={form.display_order}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-field checkbox-field">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-primary-button">
              {editingId ? 'Update Statistic' : 'Add Statistic'}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* STATISTICS LIST */}
      <section className="admin-list-section">
        <div className="admin-list-header">
          <h2>Current Statistics</h2>

          <button className="admin-secondary-button" onClick={fetchStats}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading statistics...</p>
        ) : stats.length === 0 ? (
          <p>No statistics found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Value</th>
                  <th>Label</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.id}>
                    <td>{stat.display_order}</td>

                    <td>
                      <strong>{stat.value}</strong>
                    </td>

                    <td>{stat.label}</td>

                    <td>
                      <button
                        className={
                          stat.is_active ? 'status-active' : 'status-inactive'
                        }
                        onClick={() => toggleActive(stat)}
                      >
                        {stat.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>

                    <td>
                      <div className="admin-action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(stat)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(stat.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AchievementStatsAdmin;
