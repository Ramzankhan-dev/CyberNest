import React, { useState } from 'react';
import { User, Mail, Building2, Shield, Clock, Edit3, Save, Lock } from 'lucide-react';
import { C, S } from '../theme';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';

export function ProfilePage({ toast }) {
  // Read from localStorage once on mount
  const [editName, setEditName] = useState(localStorage.getItem('adminName') || 'Admin');
  const [editOrg, setEditOrg]   = useState(localStorage.getItem('adminOrg')  || '—');
  const email = localStorage.getItem('adminEmail') || 'admin@cybernest.com';

  const [editing, setEditing] = useState(false);

  // Derive initials from current name state (live update)
  const initials = editName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  const save = () => {
    localStorage.setItem('adminName', editName);
    localStorage.setItem('adminOrg',  editOrg);
    setEditing(false);
    toast('Profile saved!', 'success');
  };

  const cancel = () => {
    // Revert to whatever is currently saved
    setEditName(localStorage.getItem('adminName') || 'Admin');
    setEditOrg(localStorage.getItem('adminOrg')   || '—');
    setEditing(false);
  };

  // Fields use state directly — always in sync
  const fields = [
    { icon: User,      label: 'Full Name',      value: editName, key: 'name',   editable: true  },
    { icon: Mail,      label: 'Email Address',  value: email,    key: 'email',  editable: false },
    { icon: Building2, label: 'Organization',   value: editOrg,  key: 'org',    editable: true  },
    { icon: Shield,    label: 'Role',           value: 'System Administrator', key: 'role', editable: false },
    { icon: Clock,     label: 'Member Since',
      value: new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long' }),
      key: 'joined', editable: false },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: 600 }}>
        <PageHeader title="Admin Profile" subtitle="Manage your account information" />

        {/* Avatar Card */}
        <div style={{ ...S.card, padding: '1.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: 68, height: 68, borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(14,116,144,0.3), rgba(124,58,237,0.2))',
            border: `2px solid rgba(34,211,238,0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: 700, color: C.cyan400,
            fontFamily: 'monospace', flexShrink: 0,
            boxShadow: '0 0 20px rgba(34,211,238,0.1)'
          }}>
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            {/* Name & email always reflect current state */}
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: C.text50, margin: '0 0 0.25rem' }}>
              {editName}
            </p>
            <p style={{ fontSize: '0.78rem', color: C.text500, margin: '0 0 0.5rem', fontFamily: 'monospace' }}>
              {email}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.2rem 0.625rem', borderRadius: 9999,
              backgroundColor: 'rgba(34,211,238,0.08)', border: `1px solid rgba(34,211,238,0.2)`,
              fontSize: '0.68rem', color: C.cyan400, letterSpacing: '0.06em'
            }}>
              <Shield size={10} /> SYSTEM ADMIN
            </span>
          </div>

          <button
            onClick={() => editing ? cancel() : setEditing(true)}
            style={{ ...S.btnSecondary, padding: '0.5rem 0.875rem' }}
          >
            <Edit3 size={14} /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Account Details */}
        <SectionCard style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Account Details
          </p>

          {fields.map((f, i) => (
            <div key={f.key} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 0',
              borderBottom: i < fields.length - 1 ? `1px solid ${C.border800}` : 'none'
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: '0.5rem',
                backgroundColor: C.bg800, border: `1px solid ${C.border700}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <f.icon size={14} color={C.text500} />
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {f.label}
                </p>

                {editing && f.editable ? (
                  <input
                    type="text"
                    value={f.key === 'name' ? editName : editOrg}
                    onChange={e => f.key === 'name' ? setEditName(e.target.value) : setEditOrg(e.target.value)}
                    style={{ ...S.input, fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
                    onFocus={e => { e.target.style.borderColor = C.cyan400; e.target.style.boxShadow = `0 0 0 3px ${C.cyan400}15`; }}
                    onBlur={e => { e.target.style.borderColor = C.border700; e.target.style.boxShadow = 'none'; }}
                  />
                ) : (
                  <p style={{
                    fontSize: '0.875rem',
                    color: f.editable ? C.text300 : C.text400,
                    margin: 0,
                    fontFamily: f.key === 'email' ? 'monospace' : 'inherit'
                  }}>
                    {f.value}
                  </p>
                )}
              </div>
            </div>
          ))}

          {editing && (
            <div style={{ marginTop: '1.25rem' }}>
              <button style={S.btnPrimary} onClick={save}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}
        </SectionCard>

        {/* Security */}
        <SectionCard>
          <p style={{ fontSize: '0.68rem', color: C.text500, margin: '0 0 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Security
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '0.5rem',
                backgroundColor: C.bg800, border: `1px solid ${C.border700}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Lock size={14} color={C.text500} />
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: C.text300, margin: '0 0 0.15rem' }}>Password</p>
                <p style={{ fontSize: '0.75rem', color: C.text500, margin: 0 }}>Last changed: Never</p>
              </div>
            </div>
            <button style={S.btnSecondary} onClick={() => toast('Password change feature — coming soon', 'info')}>
              Change
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}