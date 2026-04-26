import React, { useState } from 'react';
import {
  User, Mail, Building2, Shield, Clock,
  Edit3, Save, Lock, X, CheckCircle
} from 'lucide-react';
import { C, S } from '../theme';
import { PageHeader } from '../components/PageHeader';

// ─────────────────────────────────────────────
// ProfilePage Component
// Shows admin info read from localStorage.
// User can edit Name and Organization inline.
// ─────────────────────────────────────────────
export function ProfilePage({ toast }) {

  // --- Read saved values from localStorage on mount ---
  const savedName  = localStorage.getItem('adminName')  || 'Admin';
  const savedOrg   = localStorage.getItem('adminOrg')   || '—';
  const savedEmail = localStorage.getItem('adminEmail') || 'admin@cybernest.com';

  // --- State: edit mode toggle + editable field values ---
  const [editing,  setEditing]  = useState(false);
  const [editName, setEditName] = useState(savedName);
  const [editOrg,  setEditOrg]  = useState(savedOrg);
  const [saved,    setSaved]    = useState(false); // controls success banner

  // --- Derive two-letter initials from current name ---
  const initials = editName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  // --- Save: persist to localStorage, exit edit mode, show success banner ---
  const handleSave = () => {
    localStorage.setItem('adminName', editName);
    localStorage.setItem('adminOrg',  editOrg);
    setEditing(false);
    setSaved(true);
    toast?.('Profile updated successfully!', 'success');
    setTimeout(() => setSaved(false), 2500); // hide banner after 2.5s
  };

  // --- Cancel: revert inputs to last saved values, exit edit mode ---
  const handleCancel = () => {
    setEditName(localStorage.getItem('adminName') || 'Admin');
    setEditOrg(localStorage.getItem('adminOrg')   || '—');
    setEditing(false);
  };

  // --- Field config: drives the Account Details list ---
  const fields = [
    { key: 'name',   icon: User,      label: 'Full Name',      value: editName,    editable: true,  mono: false },
    { key: 'email',  icon: Mail,      label: 'Email Address',  value: savedEmail,  editable: false, mono: true  },
    { key: 'org',    icon: Building2, label: 'Organization',   value: editOrg,     editable: true,  mono: false },
    { key: 'role',   icon: Shield,    label: 'Role',           value: 'System Administrator', editable: false, mono: false },
    {
      key: 'joined', icon: Clock, label: 'Member Since',
      value: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long' }),
      editable: false, mono: false,
    },
  ];

  // ─────────────────────────────────────────────
  // Styles — flat objects, easy to read & debug
  // ─────────────────────────────────────────────
  const st = {

    // Scrollable full-height wrapper
    page: {
      height: '100%',
      overflowY: 'auto',
      padding: '2rem 1.5rem 3rem',
      boxSizing: 'border-box',
    },

    // Centered content column (max 640px for readability)
    inner: {
      maxWidth: 640,
      margin: '0 auto',
    },

    // ── Avatar card ──────────────────────────
    avatarCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem',
      padding: '1.5rem',
      backgroundColor: 'rgba(15,23,42,0.7)',
      border: '1px solid rgba(30,41,59,0.8)',
      borderRadius: '0.875rem',
      marginBottom: '1rem',
      flexWrap: 'wrap',   // stacks on narrow screens
    },

    avatarCircle: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(14,116,144,0.4), rgba(124,58,237,0.25))',
      border: '2px solid rgba(34,211,238,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      fontWeight: 700,
      color: '#22d3ee',
      fontFamily: 'monospace',
      flexShrink: 0,
    },

    avatarInfo: {
      flex: 1,
      minWidth: 0,  // needed so text truncation works inside flex
    },

    avatarName: {
      fontSize: '1.05rem',
      fontWeight: 700,
      color: '#f1f5f9',
      margin: '0 0 0.2rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    avatarEmail: {
      fontSize: '0.77rem',
      color: '#64748b',
      margin: '0 0 0.5rem',
      fontFamily: 'monospace',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.18rem 0.6rem',
      borderRadius: 9999,
      backgroundColor: 'rgba(34,211,238,0.07)',
      border: '1px solid rgba(34,211,238,0.18)',
      fontSize: '0.63rem',
      color: '#22d3ee',
      letterSpacing: '0.07em',
    },

    editToggleBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(30,41,59,0.9)',
      backgroundColor: 'rgba(30,41,59,0.5)',
      color: '#94a3b8',
      fontSize: '0.8rem',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },

    // ── Generic section card ─────────────────
    card: {
      backgroundColor: 'rgba(15,23,42,0.7)',
      border: '1px solid rgba(30,41,59,0.8)',
      borderRadius: '0.875rem',
      padding: '1.25rem 1.5rem',
      marginBottom: '1rem',
    },

    sectionTitle: {
      fontSize: '0.63rem',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: 700,
      margin: '0 0 0.875rem',
    },

    // ── Field row ────────────────────────────
    row: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      padding: '0.7rem 0',
    },

    rowIcon: {
      width: 32,
      height: 32,
      borderRadius: '0.45rem',
      backgroundColor: 'rgba(15,23,42,0.9)',
      border: '1px solid rgba(30,41,59,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    rowLabel: {
      fontSize: '0.63rem',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      margin: '0 0 0.18rem',
    },

    rowValue: {
      fontSize: '0.875rem',
      margin: 0,
    },

    divider: {
      height: 1,
      backgroundColor: 'rgba(30,41,59,0.7)',
    },

    // ── Input (edit mode) ────────────────────
    input: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      backgroundColor: 'rgba(15,23,42,0.9)',
      border: '1px solid rgba(30,41,59,0.9)',
      borderRadius: '0.45rem',
      color: '#f1f5f9',
      fontSize: '0.875rem',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      transition: 'border-color 0.18s, box-shadow 0.18s',
    },

    // ── Action buttons (save / cancel) ───────
    actionRow: {
      display: 'flex',
      gap: '0.625rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid rgba(30,41,59,0.7)',
    },

    saveBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.52rem 1.1rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(14,116,144,0.18)',
      border: '1px solid rgba(34,211,238,0.28)',
      color: '#22d3ee',
      fontSize: '0.82rem',
      fontWeight: 600,
      cursor: 'pointer',
    },

    cancelBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.52rem 0.9rem',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      border: '1px solid rgba(30,41,59,0.9)',
      color: '#64748b',
      fontSize: '0.82rem',
      cursor: 'pointer',
    },

    // ── Saved success banner ─────────────────
    successBanner: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.35rem 0.85rem',
      borderRadius: 9999,
      backgroundColor: 'rgba(52,211,153,0.08)',
      border: '1px solid rgba(52,211,153,0.2)',
      color: '#34d399',
      fontSize: '0.78rem',
      marginBottom: '1rem',
    },

    // ── Security section ─────────────────────
    securityRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    },

    changeBtn: {
      padding: '0.45rem 0.875rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(30,41,59,0.9)',
      backgroundColor: 'transparent',
      color: '#64748b',
      fontSize: '0.8rem',
      cursor: 'pointer',
      flexShrink: 0,
    },
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div style={st.page}>
      <div style={st.inner}>

        {/* Page title */}
        <PageHeader
          title="Admin Profile"
          subtitle="View and manage your account information"
        />

        {/* Success banner — visible for 2.5s after save */}
        {saved && (
          <div style={st.successBanner}>
            <CheckCircle size={13} />
            Profile saved successfully
          </div>
        )}

        {/* ── Avatar card ── */}
        <div style={st.avatarCard}>

          {/* Initials avatar circle */}
          <div style={st.avatarCircle}>{initials}</div>

          {/* Name, email, role badge */}
          <div style={st.avatarInfo}>
            <p style={st.avatarName}>{editName}</p>
            <p style={st.avatarEmail}>{savedEmail}</p>
            <span style={st.badge}>
              <Shield size={9} /> SYSTEM ADMIN
            </span>
          </div>

          {/* Edit / Cancel toggle */}
          <button
            style={st.editToggleBtn}
            onClick={() => editing ? handleCancel() : setEditing(true)}
          >
            {editing ? <X size={13} /> : <Edit3 size={13} />}
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* ── Account Details card ── */}
        <div style={st.card}>
          <p style={st.sectionTitle}>Account Details</p>

          {fields.map((field, index) => (
            <div key={field.key}>

              {/* Single field row */}
              <div style={st.row}>

                {/* Icon */}
                <div style={st.rowIcon}>
                  <field.icon size={13} color="#475569" />
                </div>

                {/* Label + value (or input when editing) */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={st.rowLabel}>{field.label}</p>

                  {editing && field.editable ? (
                    // Editable text input
                    <input
                      type="text"
                      value={field.key === 'name' ? editName : editOrg}
                      onChange={e =>
                        field.key === 'name'
                          ? setEditName(e.target.value)
                          : setEditOrg(e.target.value)
                      }
                      style={st.input}
                      onFocus={e => {
                        e.target.style.borderColor = '#22d3ee';
                        e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.1)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(30,41,59,0.9)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : (
                    // Read-only display
                    <p style={{
                      ...st.rowValue,
                      fontFamily: field.mono ? 'monospace' : 'inherit',
                      color: field.editable ? '#cbd5e1' : '#64748b',
                    }}>
                      {field.value}
                    </p>
                  )}
                </div>
              </div>

              {/* Thin divider between rows (skip after last) */}
              {index < fields.length - 1 && <div style={st.divider} />}
            </div>
          ))}

          {/* Save / Cancel — only visible in edit mode */}
          {editing && (
            <div style={st.actionRow}>
              <button style={st.saveBtn} onClick={handleSave}>
                <Save size={13} /> Save Changes
              </button>
              <button style={st.cancelBtn} onClick={handleCancel}>
                <X size={13} /> Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Security card ── */}
        <div style={st.card}>
          <p style={st.sectionTitle}>Security</p>

          <div style={st.securityRow}>

            {/* Lock icon + password info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={st.rowIcon}>
                <Lock size={13} color="#475569" />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', margin: '0 0 0.15rem' }}>
                  Password
                </p>
                <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>
                  Last changed: Never
                </p>
              </div>
            </div>

            {/* Change password button */}
            <button
              style={st.changeBtn}
              onClick={() => toast?.('Password change — coming soon', 'info')}
            >
              Change
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}