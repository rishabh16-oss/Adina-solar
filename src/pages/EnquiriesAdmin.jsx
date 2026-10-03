import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enquiries:', error);
      setError(error.message);
    } else {
      setEnquiries(data || []);
    }

    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
      return;
    }

    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status } : enquiry
      )
    );
  };

  const updateNotes = async (id, admin_notes) => {
    const { error } = await supabase
      .from('enquiries')
      .update({ admin_notes })
      .eq('id', id);

    if (error) {
      console.error('Error updating notes:', error);
      alert('Failed to save notes.');
      return;
    }

    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, admin_notes } : enquiry
      )
    );
  };

  const deleteEnquiry = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this enquiry?'
    );

    if (!confirmed) return;

    const { error } = await supabase.from('enquiries').delete().eq('id', id);

    if (error) {
      console.error('Error deleting enquiry:', error);
      alert('Failed to delete enquiry.');
      return;
    }

    setEnquiries((current) => current.filter((enquiry) => enquiry.id !== id));
  };

  return (
    <main className="enquiries-admin">
      <div className="admin-page-header">
        <div>
          <p className="section-label">ADMIN PANEL</p>
          <h1>Customer Enquiries</h1>
          <p>View and manage enquiries submitted through the website.</p>
        </div>

        <button className="refresh-button" onClick={fetchEnquiries}>
          ↻ Refresh
        </button>
      </div>

      {loading && <p className="enquiries-status">Loading enquiries...</p>}

      {error && <div className="enquiries-error">Error: {error}</div>}

      {!loading && !error && enquiries.length === 0 && (
        <div className="no-enquiries">
          <h2>No Enquiries Yet</h2>
          <p>
            Customer enquiries submitted from the Contact page will appear here.
          </p>
        </div>
      )}

      {!loading && !error && enquiries.length > 0 && (
        <div className="enquiries-list">
          {enquiries.map((enquiry) => (
            <div className="enquiry-card" key={enquiry.id}>
              <div className="enquiry-header">
                <div>
                  <h2>{enquiry.name}</h2>

                  <p className="enquiry-date">
                    {new Date(enquiry.created_at).toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  className="delete-enquiry"
                  onClick={() => deleteEnquiry(enquiry.id)}
                >
                  Delete
                </button>
              </div>

              <div className="enquiry-details">
                <div>
                  <strong>Email</strong>
                  <p>{enquiry.email}</p>
                </div>

                <div>
                  <strong>Phone</strong>
                  <p>{enquiry.phone}</p>
                </div>

                <div>
                  <strong>Company</strong>
                  <p>{enquiry.company || '—'}</p>
                </div>

                <div>
                  <strong>City</strong>
                  <p>{enquiry.city || '—'}</p>
                </div>

                <div>
                  <strong>Service</strong>
                  <p>{enquiry.service}</p>
                </div>
              </div>

              <div className="enquiry-message">
                <strong>Message</strong>
                <p>{enquiry.message}</p>
              </div>

              <div className="enquiry-management">
                <div className="status-section">
                  <label>Status</label>

                  <select
                    value={enquiry.status}
                    onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                  >
                    <option value="new">New</option>

                    <option value="contacted">Contacted</option>

                    <option value="in_progress">In Progress</option>

                    <option value="completed">Completed</option>

                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="notes-section">
                  <label>Admin Notes</label>

                  <textarea
                    rows="3"
                    defaultValue={enquiry.admin_notes || ''}
                    placeholder="Add notes about this enquiry..."
                    onBlur={(e) => updateNotes(enquiry.id, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default EnquiriesAdmin;
