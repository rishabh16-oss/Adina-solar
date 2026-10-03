import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      setError('Unable to load projects.');
    } else {
      setProjects(data);
    }

    setLoading(false);
  };

  return (
    <main className="inner-page">
      {/* Page Hero */}
      <section className="page-hero">
        <p className="section-label">OUR WORK</p>

        <h1>Our Solar Projects</h1>

        <p>
          Explore some of the solar installations completed by Adina Solar
          Solutions.
        </p>
      </section>

      {/* Projects */}
      <section className="projects-page">
        {/* Loading */}
        {loading && <p className="projects-status">Loading projects...</p>}

        {/* Error */}
        {error && <p className="projects-status">{error}</p>}

        {/* Project Grid */}
        {!loading && !error && (
          <div className="project-grid">
            {projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-image">
                  <img
                    src={
                      project.image_url ||
                      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80'
                    }
                    alt={project.title}
                  />
                </div>

                <div className="project-info">
                  <span>{project.capacity}</span>

                  <h3>{project.title}</h3>

                  <p>📍 {project.location}</p>

                  <a href="/contact">View Project →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Projects;
