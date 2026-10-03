import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    location: '',
    capacity: '',
    project_type: '',
    description: '',
    image_url: '',
    completion_date: '',
    is_published: true,
    display_order: 0,
  });

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
      return;
    }

    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle input
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
      location: '',
      capacity: '',
      project_type: '',
      description: '',
      image_url: '',
      completion_date: '',
      is_published: true,
      display_order: 0,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // Add / Update project
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    const projectData = {
      title: form.title,
      location: form.location,
      capacity: form.capacity,
      project_type: form.project_type,
      description: form.description,
      image_url: form.image_url,
      completion_date: form.completion_date || null,
      is_published: form.is_published,
      display_order: Number(form.display_order) || 0,
    };

    let error;

    if (editingId) {
      const result = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingId);

      error = result.error;
    } else {
      const result = await supabase.from('projects').insert([projectData]);

      error = result.error;
    }

    setSaving(false);

    if (error) {
      console.error('Project save error:', error);
      alert(error.message);
      return;
    }

    alert(editingId ? 'Project updated!' : 'Project added!');

    resetForm();
    fetchProjects();
  };

  // Edit
  const handleEdit = (project) => {
    setForm({
      title: project.title || '',
      location: project.location || '',
      capacity: project.capacity || '',
      project_type: project.project_type || '',
      description: project.description || '',
      image_url: project.image_url || '',
      completion_date: project.completion_date || '',
      is_published: project.is_published,
      display_order: project.display_order || 0,
    });

    setEditingId(project.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      alert(error.message);
      return;
    }

    fetchProjects();
  };

  // Toggle published
  const togglePublished = async (project) => {
    const { error } = await supabase
      .from('projects')
      .update({
        is_published: !project.is_published,
      })
      .eq('id', project.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchProjects();
  };

  return (
    <div className="projects-admin">
      {/* HEADER */}
      <div className="projects-admin-header">
        <div>
          <h1>Manage Projects</h1>
          <p>Add and manage Adina Solar Solutions projects.</p>
        </div>

        <button
          className="add-project-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Project
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <section className="project-form-card">
          <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="project-form-grid">
              <div className="form-group">
                <label>Project Title *</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Residential Solar Installation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Indore"
                  required
                />
              </div>

              <div className="form-group">
                <label>Capacity</label>

                <input
                  type="text"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="10 kW"
                />
              </div>

              <div className="form-group">
                <label>Project Type</label>

                <select
                  name="project_type"
                  value={form.project_type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div className="form-group">
                <label>Completion Date</label>

                <input
                  type="date"
                  name="completion_date"
                  value={form.completion_date}
                  onChange={handleChange}
                />
              </div>

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

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the project..."
                rows="5"
              />
            </div>

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

            <label className="publish-checkbox">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
              />
              Publish this project
            </label>

            <div className="form-actions">
              <button
                type="submit"
                className="save-project-btn"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                  ? 'Update Project'
                  : 'Add Project'}
              </button>

              <button
                type="button"
                className="cancel-project-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* PROJECT LIST */}
      <section className="projects-list">
        <h2>Existing Projects</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="project-admin-grid">
            {projects.map((project) => (
              <div className="project-admin-card" key={project.id}>
                {project.image_url && (
                  <img src={project.image_url} alt={project.title} />
                )}

                <div className="project-admin-card-content">
                  <div className="project-status">
                    {project.is_published ? 'Published' : 'Draft'}
                  </div>

                  <h3>{project.title}</h3>

                  <p>📍 {project.location}</p>

                  {project.capacity && <p>⚡ {project.capacity}</p>}

                  {project.project_type && <p>🔧 {project.project_type}</p>}

                  <div className="project-card-actions">
                    <button onClick={() => handleEdit(project)}>Edit</button>

                    <button onClick={() => togglePublished(project)}>
                      {project.is_published ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(project.id)}
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

export default ProjectsAdmin;
