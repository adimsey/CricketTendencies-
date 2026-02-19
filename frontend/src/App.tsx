import { useState } from 'react';
import type { Format, Role } from './types/cricket';
import { FORMAT_LABELS } from './types/cricket';
import { useTeams, usePlayers, usePlayerData } from './hooks/useApi';
import BatterProfile from './components/BatterProfile';
import BowlerProfile from './components/BowlerProfile';

const FORMATS: Format[] = ['tests', 'odis', 't20is', 'ipl'];
const ROLES: Role[] = ['batter', 'bowler'];

const Chip = ({
  label, active, onClick, color = '#22c55e',
}: { label: string; active: boolean; onClick: () => void; color?: string }) => (
  <button
    onClick={onClick}
    style={{
      padding: '7px 16px',
      borderRadius: 8,
      border: `1px solid ${active ? color : '#1e293b'}`,
      background: active ? `${color}22` : '#111827',
      color: active ? color : '#64748b',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      transition: 'all 0.15s',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
);

const Select = ({
  value, onChange, options, placeholder, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={disabled}
    style={{
      background: '#111827',
      border: '1px solid #1e293b',
      color: value ? '#f1f5f9' : '#475569',
      borderRadius: 8,
      padding: '9px 14px',
      fontSize: 14,
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      width: '100%',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <option value="">{placeholder}</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 80 }}>
      <div style={{
        width: 48, height: 48, border: '3px solid #1e293b',
        borderTop: '3px solid #22c55e', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ color: '#475569', fontSize: 14 }}>Loading player data...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<Format | ''>('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const { teams, loading: teamsLoading } = useTeams();
  const { players, loading: playersLoading } = usePlayers(selectedTeam, selectedFormat, selectedRole);
  const { data, loading: dataLoading, error } = usePlayerData(selectedPlayer, selectedFormat, selectedRole);

  const handleTeamChange = (team: string) => {
    setSelectedTeam(team);
    setSelectedPlayer('');
  };
  const handleFormatChange = (fmt: Format) => {
    setSelectedFormat(fmt);
    setSelectedPlayer('');
  };
  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setSelectedPlayer('');
  };
  const handlePlayerChange = (player: string) => {
    setSelectedPlayer(player);
  };

  const teamNames = teams.map(t => t.name);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1e293b',
        background: '#0d1424',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏏</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
              CRICKET TENDENCIES
            </span>
          </div>
          <div style={{ height: 20, width: 1, background: '#1e293b' }} />
          <span style={{ color: '#475569', fontSize: 13 }}>Player Analysis Dashboard</span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {/* Selector bar */}
        <div style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}>
          <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            Select Player
          </div>

          {/* Format chips */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#475569', fontSize: 11, marginBottom: 8 }}>Format</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FORMATS.map(fmt => (
                <Chip key={fmt} label={FORMAT_LABELS[fmt]} active={selectedFormat === fmt}
                  onClick={() => handleFormatChange(fmt)} color="#22c55e" />
              ))}
            </div>
          </div>

          {/* Role chips */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#475569', fontSize: 11, marginBottom: 8 }}>Role</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {ROLES.map(role => (
                <Chip key={role} label={role === 'batter' ? '🏏 Batter' : '⚾ Bowler'}
                  active={selectedRole === role}
                  onClick={() => handleRoleChange(role)}
                  color={role === 'batter' ? '#22c55e' : '#3b82f6'} />
              ))}
            </div>
          </div>

          {/* Team + Player dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 6 }}>Team</div>
              <Select
                value={selectedTeam}
                onChange={handleTeamChange}
                options={teamsLoading ? [] : teamNames}
                placeholder="Select a team..."
                disabled={teamsLoading}
              />
            </div>
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 6 }}>Player</div>
              <Select
                value={selectedPlayer}
                onChange={handlePlayerChange}
                options={players}
                placeholder={!selectedTeam || !selectedFormat || !selectedRole ? "Select team, format & role first" : playersLoading ? "Loading..." : "Select a player..."}
                disabled={!selectedTeam || !selectedFormat || !selectedRole || playersLoading}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        {!selectedPlayer && !dataLoading && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏏</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              Explore Cricket Tendencies
            </h2>
            <p style={{ color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
              Select a format, role, team and player above to see detailed batting or bowling tendencies —
              wagon wheels, pitch maps, phase analysis and more.
            </p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
              {[
                { icon: '🎯', label: 'Wagon Wheel', desc: 'Scoring zones visualised' },
                { icon: '📍', label: 'Pitch Map', desc: 'Line & length heatmaps' },
                { icon: '📊', label: 'Phase Analysis', desc: 'Powerplay to death' },
                { icon: '🔄', label: 'vs Pace/Spin', desc: 'Bowling type matchups' },
              ].map(({ icon, label, desc }) => (
                <div key={label} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 12, padding: '16px 20px', minWidth: 150 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>{label}</div>
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {dataLoading && <LoadingSpinner />}

        {error && (
          <div style={{ background: '#1a0f0f', border: '1px solid #ef444433', borderRadius: 12, padding: 20, color: '#ef4444', textAlign: 'center' }}>
            {error} — this player/format combination may not have data yet.
          </div>
        )}

        {data && !dataLoading && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            {data.role === 'batter'
              ? <BatterProfile data={data as any} />
              : <BowlerProfile data={data as any} />
            }
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e293b', padding: '16px 24px', marginTop: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#334155', fontSize: 12 }}>
            Data: <a href="https://cricsheet.org" style={{ color: '#475569' }} target="_blank" rel="noopener">Cricsheet.org</a> (open license)
          </span>
          <span style={{ color: '#334155', fontSize: 12 }}>CricketTendencies</span>
        </div>
      </footer>
    </div>
  );
}
