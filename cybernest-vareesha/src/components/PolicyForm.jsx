import { useState } from 'react'
import { createPolicy } from '../services/api'

export default function PolicyForm({ onCreated }) {
  const [form, setForm]       = useState({ camera: false, app_install: false, location: true })
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState('')

  const toggle = (field) => setForm(f => ({ ...f, [field]: !f[field] }))

  const handleSubmit = async () => {
    setLoading(true)
    setResult('')
    try {
      await createPolicy(form)
      setResult('✓ Policy created')
      if (onCreated) onCreated()
    } catch {
      setResult('✗ Creation failed')
    } finally {
      setLoading(false)
    }
  }

  const toggles = [
    { key: 'camera',      label: 'Camera Access' },
    { key: 'app_install', label: 'App Installation' },
    { key: 'location',    label: 'Location Tracking' },
  ]

  return (
    <div className="cyber-card corner-bracket" style={{ padding: '24px' }}>
      <div className="cyber-label" style={{ marginBottom: '20px' }}>Create New Policy</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {toggles.map(({ key, label }) => (
          <div
            key={key}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px',
              border: '1px solid var(--border)',
              background: form[key] ? 'rgba(0,255,65,0.04)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div>
              <div className="font-display" style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>
                {label}
              </div>
              <div className="font-mono" style={{ fontSize: '0.6rem', color: form[key] ? 'var(--green)' : 'var(--red)', marginTop: '2px' }}>
                {form[key] ? 'PERMITTED' : 'RESTRICTED'}
              </div>
            </div>

            {/* Toggle */}
            <label className="cyber-toggle" onClick={() => toggle(key)}>
              <input type="checkbox" readOnly checked={form[key]} />
              <div className="track" />
              <div className="thumb" />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-cyber"
        style={{ marginTop: '20px', width: '100%', padding: '12px', fontSize: '0.65rem' }}
      >
        {loading ? <span className="font-mono">CREATING<span className="cursor-blink">_</span></span> : '+ CREATE POLICY'}
      </button>

      {result && (
        <div className="font-mono" style={{
          marginTop: '12px', fontSize: '0.75rem',
          color: result.startsWith('✓') ? 'var(--green)' : 'var(--red)',
        }}>
          {result}
        </div>
      )}
    </div>
  )
}
