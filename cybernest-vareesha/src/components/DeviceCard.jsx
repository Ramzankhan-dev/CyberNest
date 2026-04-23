import { useNavigate } from 'react-router-dom'

export default function DeviceCard({ device: d }) {
  const navigate = useNavigate()

  return (
    <div
      className="cyber-card corner-bracket"
      style={{ padding: '20px', cursor: 'pointer' }}
      onClick={() => navigate(`/devices/${d.device_id}`)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div className="cyber-label">Device ID</div>
          <div className="font-mono" style={{ color: 'var(--green)', fontSize: '0.85rem' }}>
            {d.device_id}
          </div>
        </div>
        {d.status === 'online'
          ? <span className="status-online">ONLINE</span>
          : <span className="status-offline">OFFLINE</span>
        }
      </div>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="cyber-label" style={{ margin: 0 }}>User ID</span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {d.user_id}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="cyber-label" style={{ margin: 0 }}>Policy</span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: d.policy_id ? 'var(--cyan)' : 'var(--text-muted)' }}>
            {d.policy_id ? `#${d.policy_id}` : 'NONE'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="cyber-label" style={{ margin: 0 }}>Last Seen</span>
          <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            {new Date(d.last_seen).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div style={{ marginTop: '16px', height: '1px', background: 'var(--border)' }} />
      <div style={{ marginTop: '10px' }}>
        <div className="terminal-line" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
          Click to inspect device
        </div>
      </div>
    </div>
  )
}
