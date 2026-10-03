import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Admin() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate('/login');
      return;
    }

    setUser(user);

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Profile error:', error);
      setLoading(false);
      return;
    }

    if (profileData.role !== 'owner' && profileData.role !== 'admin') {
      await supabase.auth.signOut();
      navigate('/login');
      return;
    }

    setProfile(profileData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* HEADER */}
      <header className="admin-header">
        <div>
          <h2>Adina Solar Solutions</h2>
          <p>Admin Dashboard</p>
        </div>

        <div className="admin-user">
          <div>
            <strong>{profile?.full_name}</strong>
            <span>{profile?.role}</span>
          </div>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <h1>Dashboard</h1>

        <p className="admin-welcome">Welcome back, {profile?.full_name}!</p>

        {/* STAT CARDS */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-icon">📁</div>
            <div>
              <h3>Projects</h3>
              <p>Manage projects</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🔧</div>
            <div>
              <h3>Services</h3>
              <p>Manage services</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">🏆</div>
            <div>
              <h3>Achievements</h3>
              <p>Manage achievements</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">📩</div>
            <div>
              <h3>Enquiries</h3>
              <p>View customer enquiries</p>
            </div>
          </div>
        </section>

        {/* MANAGEMENT */}
        <section className="admin-management">
          <h2>Manage Website</h2>

          <div className="admin-menu">
            <button onClick={() => navigate('/admin/projects')}>
              <span>📁</span>
              <div>
                <strong>Projects</strong>
                <small>Add, edit and delete projects</small>
              </div>
            </button>

            <button onClick={() => navigate('/admin/services')}>
              <span>🔧</span>
              <div>
                <strong>Services</strong>
                <small>Manage solar services</small>
              </div>
            </button>

            <button onClick={() => navigate('/admin/achievements')}>
              <span>🏆</span>
              <div>
                <strong>Achievements</strong>
                <small>Manage company achievements</small>
              </div>
            </button>

            <button onClick={() => navigate('/admin/enquiries')}>
              <span>📩</span>
              <div>
                <strong>Enquiries</strong>
                <small>View customer enquiries</small>
              </div>
            </button>

            <button onClick={() => navigate('/admin/achievement-stats')}>
              <span>🏆</span>
              <div>
                <strong> Achievement Statistics </strong>
                <small> Change achievement stats</small>
              </div>
            </button>

            <button onClick={() => navigate('/admin/settings')}>
              <span>⚙️</span>
              <div>
                <strong>Site Settings</strong>
                <small>Edit company information</small>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
