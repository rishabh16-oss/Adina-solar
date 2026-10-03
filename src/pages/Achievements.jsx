import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      setError('Unable to load achievements.');
    } else {
      setAchievements(data);
    }

    setLoading(false);
  };

  return (
    <main className="inner-page">
      {/* HERO */}
      <section className="page-hero">
        <p className="section-label">OUR ACHIEVEMENTS</p>

        <h1>Making an Impact Through Solar</h1>

        <p>
          Every installation is a step towards a cleaner and more sustainable
          future.
        </p>
      </section>

      {/* STATS */}
      <section className="achievement-stats">
        <div className="achievement-stat">
          <h2>500+</h2>
          <p>Solar Projects</p>
        </div>

        <div className="achievement-stat">
          <h2>1000+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="achievement-stat">
          <h2>5 MW+</h2>
          <p>Installed Capacity</p>
        </div>

        <div className="achievement-stat">
          <h2>10+</h2>
          <p>Years of Experience</p>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="achievement-content">
        <div>
          <p className="section-label">WHY IT MATTERS</p>

          <h2>
            Creating a<span> Sustainable Impact</span>
          </h2>

          <p>
            Our work goes beyond installing solar panels. Every project helps
            customers move towards cleaner energy while reducing dependence on
            conventional electricity sources.
          </p>

          <p>
            As our projects grow, so does our contribution towards a more
            sustainable energy future.
          </p>
        </div>

        <div className="achievement-list">
          <div>
            <strong>01</strong>
            <h3>Clean Energy</h3>
            <p>Helping customers adopt renewable energy.</p>
          </div>

          <div>
            <strong>02</strong>
            <h3>Cost Savings</h3>
            <p>Reducing long-term electricity expenses.</p>
          </div>

          <div>
            <strong>03</strong>
            <h3>Customer Trust</h3>
            <p>Building lasting relationships through quality service.</p>
          </div>
        </div>
      </section>

      {/* DATABASE ACHIEVEMENTS */}
      <section className="achievement-dynamic-section">
        <div className="section-heading">
          <p className="section-label">OUR JOURNEY</p>

          <h2>Achievements Along the Way</h2>

          <p>
            Here are some of the milestones achieved through our solar projects
            and customer relationships.
          </p>
        </div>

        {loading && (
          <p className="achievement-status">Loading achievements...</p>
        )}

        {error && <p className="achievement-status">{error}</p>}

        {!loading && !error && achievements.length === 0 && (
          <p className="achievement-status">
            No achievements available at the moment.
          </p>
        )}

        {!loading && !error && achievements.length > 0 && (
          <div className="achievement-dynamic-grid">
            {achievements.map((achievement) => (
              <div className="achievement-dynamic-card" key={achievement.id}>
                {achievement.image_url && (
                  <div className="achievement-dynamic-image">
                    <img src={achievement.image_url} alt={achievement.title} />
                  </div>
                )}

                <div className="achievement-dynamic-info">
                  {achievement.achievement_date && (
                    <small>
                      {new Date(
                        achievement.achievement_date
                      ).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </small>
                  )}

                  <h3>{achievement.title}</h3>

                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Achievements;
