import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);
  const [form, setForm] = useState({ receiverId: '', skill: '', date: '', time: '', message: '' });
  const [booking, setBooking] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: '' });
  const [activeTab, setActiveTab] = useState('all');

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const currentUserId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    loadSessions();
    loadMatches();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sessions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data);
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  const loadMatches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/matches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(res.data);
    } catch (e) { console.log(e); }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: '' }), 3000);
  };

  const bookSession = async () => {
    if (!form.receiverId || !form.skill || !form.date || !form.time) {
      showToast('❌ Please fill all required fields!', 'error');
      return;
    }
    setBooking(true);
    try {
      await axios.post('http://localhost:5000/api/sessions/book', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('✅ Session booked successfully!', 'success');
      setShowBookForm(false);
      setForm({ receiverId: '', skill: '', date: '', time: '', message: '' });
      loadSessions();
    } catch (e) {
      showToast('❌ Booking failed. Try again.', 'error');
    }
    setBooking(false);
  };

  const updateStatus = async (sessionId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/sessions/${sessionId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`✅ Session ${status}!`, 'success');
      loadSessions();
    } catch (e) {
      showToast('❌ Failed to update session', 'error');
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'accepted') return { bg: '#F0FDF4', color: '#16A34A', border: '#86EFAC', label: '✅ Accepted' };
    if (status === 'rejected') return { bg: '#FEF2F2', color: '#EF4444', border: '#FECACA', label: '❌ Rejected' };
    return { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA', label: '⏳ Pending' };
  };

  const filteredSessions = sessions.filter(s => {
    if (activeTab === 'sent') return String(s.requester?._id) === String(currentUserId);
    if (activeTab === 'received') return String(s.receiver?._id) === String(currentUserId);
    return true;
  });

  const cardStyle = {
    background: '#fff',
    borderRadius: '20px',
    padding: '24px',
    border: '2px solid #EDE9FE',
    boxShadow: '0 4px 20px rgba(124,58,237,0.08)',
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '2px solid #EDE9FE',
    borderRadius: '12px',
    fontSize: '13px',
    outline: 'none',
    background: '#F5F3FF',
    color: '#1E1B4B',
    fontFamily: 'Poppins, sans-serif',
    boxSizing: 'border-box',
    marginBottom: '14px'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '5px'
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B' }}>📅 My Sessions</h2>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '3px' }}>Manage your skill swap sessions</p>
        </div>
        <button
          onClick={() => setShowBookForm(!showBookForm)}
          style={{ padding: '12px 22px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
        >
          + Book Session
        </button>
      </div>

      {/* Book Form */}
      {showBookForm && (
        <div style={{ ...cardStyle, marginBottom: '24px', background: '#F5F3FF', border: '2px solid #DDD6FE' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B', marginBottom: '20px' }}>📅 Book a New Session</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Select Person *</label>
              <select
                value={form.receiverId}
                onChange={e => setForm({ ...form, receiverId: e.target.value })}
                style={{ ...inputStyle }}
              >
                <option value="">-- Choose a match --</option>
                {matches.map((m, i) => (
                  <option key={i} value={m.user._id}>{m.user.name} ({m.matchPercent}% match)</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Skill to Learn *</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. React, Guitar, Python..."
                value={form.skill}
                onChange={e => setForm({ ...form, skill: e.target.value })}
              />
            </div>

            <div>
              <label style={labelStyle}>Date *</label>
              <input
                style={inputStyle}
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label style={labelStyle}>Time *</label>
              <input
                style={inputStyle}
                type="time"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Message (optional)</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="Add a note for the session..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              onClick={bookSession}
              disabled={booking}
              style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
            >
              {booking ? 'Booking...' : '📅 Confirm Booking'}
            </button>
            <button
              onClick={() => setShowBookForm(false)}
              style={{ padding: '13px 24px', background: '#fff', color: '#9CA3AF', border: '2px solid #EDE9FE', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all', label: '📋 All Sessions' },
          { key: 'sent', label: '📤 Sent' },
          { key: 'received', label: '📥 Received' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: activeTab === tab.key ? '2px solid #7C3AED' : '2px solid #EDE9FE',
              background: activeTab === tab.key ? '#F5F3FF' : '#fff',
              color: activeTab === tab.key ? '#7C3AED' : '#9CA3AF',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9CA3AF' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
          Loading sessions...
        </div>
      ) : filteredSessions.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#7C3AED', marginBottom: '8px' }}>No Sessions Yet!</h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Click "Book Session" to schedule your first skill swap!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSessions.map((session, i) => {
            const isRequester = String(session.requester?._id) === String(currentUserId);
            const otherUser = isRequester ? session.receiver : session.requester;
            const statusStyle = getStatusStyle(session.status);

            return (
              <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '20px' }}>

                {/* Avatar */}
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '20px', flexShrink: 0 }}>
                  {otherUser?.name?.charAt(0)?.toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>{otherUser?.name}</h3>
                    <span style={{ background: '#F5F3FF', color: '#7C3AED', fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '8px', border: '1px solid #DDD6FE' }}>
                      {isRequester ? '📤 Sent' : '📥 Received'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                    🎯 Skill: <strong style={{ color: '#7C3AED' }}>{session.skill}</strong>
                  </p>
                  <p style={{ fontSize: '13px', color: '#6B7280' }}>
                    📅 {session.date} at ⏰ {session.time}
                  </p>
                  {session.message && (
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', fontStyle: 'italic' }}>
                      "{session.message}"
                    </p>
                  )}
                </div>

                {/* Status & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, borderRadius: '10px', padding: '5px 14px', fontSize: '12px', fontWeight: '600' }}>
                    {statusStyle.label}
                  </span>

                  {/* Accept/Reject buttons for receiver */}
                  {!isRequester && session.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => updateStatus(session._id, 'accepted')}
                        style={{ padding: '7px 16px', background: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC', borderRadius: '10px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => updateStatus(session._id, 'rejected')}
                        style={{ padding: '7px 16px', background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA', borderRadius: '10px', fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      <div style={{
        position: 'fixed',
        bottom: '28px',
        left: '50%',
        transform: `translateX(-50%) translateY(${toast.show ? '0' : '80px'})`,
        background: toast.type === 'success' ? '#10B981' : '#EF4444',
        color: '#fff',
        padding: '13px 28px',
        borderRadius: '13px',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: 'Poppins, sans-serif',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 999,
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap'
      }}>
        {toast.msg}
      </div>

    </div>
  );
}

export default Sessions;