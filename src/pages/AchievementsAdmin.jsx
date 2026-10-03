import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    achievement_date: '',
    image_url: '',
    is_published: true,
    display_order: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Fetch achievements
  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return;
    }

    setAchievements(data);
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Add / Update achievement
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (editingId) {
      const { error } = await supabase
        .from('achievements')
        .update({
          title: form.title,
          description: form.description,
          achievement_date: form.achievement_date || null,
          image_url: form.image_url,
          is_published: form.is_published,
          display_order: Number(form.display_order),
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating achievement:', error);
        alert('Failed to update achievement.');
      } else {
        alert('Achievement updated successfully.');
      }
    } else {
      const { error } = await supabase.from('achievements').insert([
        {
          title: form.title,
          description: form.description,
          achievement_date: form.achievement_date || null,
          image_url: form.image_url,
          is_published: form.is_published,
          display_order: Number(form.display_order),
        },
      ]);

      if (error) {
        console.error('Error adding achievement:', error);
        alert('Failed to add achievement.');
      } else {
        alert('Achievement added successfully.');
      }
    }

    resetForm();
    fetchAchievements();

    setLoading(false);
  };

  // Edit
  const handleEdit = (achievement) => {
    setEditingId(achievement.id);

    setForm({
      title: achievement.title || '',
      description: achievement.description || '',
      achievement_date: achievement.achievement_date || '',
      image_url: achievement.image_url || '',
      is_published: achievement.is_published,
      display_order: achievement.display_order || 0,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this achievement?'
    );

    if (!confirmed) return;

    const { error } = await supabase.from('achievements').delete().eq('id', id);

    if (error) {
      console.error('Error deleting achievement:', error);
      alert('Failed to delete achievement.');
      return;
    }

    fetchAchievements();
  };

  // Publish / Unpublish
  const togglePublished = async (achievement) => {
    const { error } = await supabase
      .from('achievements')
      .update({
        is_published: !achievement.is_published,
      })
      .eq('id', achievement.id);

    if (error) {
      console.error('Error changing publish status:', error);
      return;
    }

    fetchAchievements();
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: '',
      description: '',
      achievement_date: '',
      image_url: '',
      is_published: true,
      display_order: 0,
    });
  };

  return (
    <main className="achievements-admin">
      <div className="achievements-admin-header">
        <p className="section-label">ADMIN PANEL</p>

        <h1>{editingId ? 'Edit Achievement' : 'Manage Achievements'}</h1>

        <p>Add, edit and manage achievements displayed on the website.</p>
      </div>

      {/* FORM */}
      <section className="achievement-admin-form">
        <h2>{editingId ? 'Edit Achievement' : 'Add New Achievement'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Example: 500+ Solar Projects"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this achievement"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Achievement Date</label>

            <input
              type="date"
              name="achievement_date"
              value={form.achievement_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>

            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Display Order</label>

            <input
              type="number"
              name="display_order"
              value={form.display_order}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              id="is-published"
            />

            <label htmlFor="is-published">Published on website</label>
          </div>

          <div className="achievement-form-buttons">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : editingId
                ? 'Update Achievement'
                : 'Add Achievement'}
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

      {/* ACHIEVEMENT LIST */}
      <section className="achievement-admin-list">
        <h2>Existing Achievements</h2>

        {achievements.length === 0 ? (
          <p>No achievements added yet.</p>
        ) : (
          <div className="achievement-admin-grid">
            {achievements.map((achievement) => (
              <div className="achievement-admin-card" key={achievement.id}>
                {achievement.image_url && (
                  <img src={achievement.image_url} alt={achievement.title} />
                )}

                <div className="achievement-admin-card-content">
                  <div className="achievement-status">
                    {achievement.is_published ? 'Published' : 'Hidden'}
                  </div>

                  <h3>{achievement.title}</h3>

                  <p>{achievement.description}</p>

                  {achievement.achievement_date && (
                    <small>Date: {achievement.achievement_date}</small>
                  )}

                  <p>Display order: {achievement.display_order}</p>

                  <div className="achievement-card-buttons">
                    <button onClick={() => handleEdit(achievement)}>
                      Edit
                    </button>

                    <button onClick={() => togglePublished(achievement)}>
                      {achievement.is_published ? 'Hide' : 'Publish'}
                    </button>

                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="delete-button"
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
    </main>
  );
}

export default AchievementsAdmin;
