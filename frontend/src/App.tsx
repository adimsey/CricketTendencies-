import { useState, useEffect, useRef } from 'react';
import type { Format, Role } from './types/cricket';
import { FORMAT_LABELS } from './types/cricket';
import { useTeams, usePlayers, usePlayerData, usePlayerSearch } from './hooks/useApi';
import type { SearchResult } from './hooks/useApi';
import BatterProfile from './components/BatterProfile';
import BowlerProfile from './components/BowlerProfile';

const INTERNATIONAL_FORMATS: Format[] = ['tests', 'odis', 't20is'];
const FRANCHISE_FORMATS: Format[] = ['ipl', 'bbl', 'psl'];
const ALL_FORMATS: Format[] = [...INTERNATIONAL_FORMATS, ...FRANCHISE_FORMATS];
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
  const [selectedFormat, setSelectedFormat] = useState<Format | ''>('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { teams, loading: teamsLoading } = useTeams();

  // Filter teams to only those that play the selected format
  const filteredTeams = selectedFormat
    ? teams.filter(t => t.formats.includes(selectedFormat as Format))
    : teams;

  const { players, loading: playersLoading } = usePlayers(selectedTeam, selectedFormat, selectedRole);
  const { results: searchResults, loading: searchLoading } = usePlayerSearch(searchQuery, selectedFormat, selectedRole);
  const { data, loading: dataLoading, error } = usePlayerData(selectedPlayer, selectedFormat, selectedRole);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleFormatChange = (fmt: Format) => {
    // Toggle off if clicking the same one
    const next = selectedFormat === fmt ? '' : fmt;
    setSelectedFormat(next);
    setSelectedTeam('');
    setSelectedPlayer('');
    setSearchQuery('');
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(prev => prev === role ? '' : role);
    setSelectedPlayer('');
    setSearchQuery('');
  };

  const handleTeamChange = (team: string) => {
    setSelectedTeam(team);
    setSelectedPlayer('');
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    setSelectedPlayer('');
    setShowDropdown(true);
  };

  const handleSearchSelect = (result: SearchResult) => {
    setSelectedPlayer(result.name);
    if (!selectedFormat) setSelectedFormat(result.format as Format);
    if (!selectedRole) setSelectedRole(result.role as Role);
    setSearchQuery(result.name);
    setShowDropdown(false);
  };

  const handlePlayerChange = (player: string) => {
    setSelectedPlayer(player);
  };

  const canSearch = !!(selectedFormat && selectedRole);
  const showTeamPlayerDropdown = !!(selectedTeam && selectedFormat && selectedRole);

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
          <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Select Player
          </div>

          {/* Competition chips — two groups */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#475569', fontSize: 11, marginBottom: 8 }}>Competition</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ color: '#334155', fontSize: 11, alignSelf: 'center', marginRight: 2 }}>International</span>
                {INTERNATIONAL_FORMATS.map(fmt => (
                  <Chip key={fmt} label={FORMAT_LABELS[fmt]} active={selectedFormat === fmt}
                    onClick={() => handleFormatChange(fmt)} color="#22c55e" />
                ))}
              </div>
              <div style={{ width: 1, height: 24, background: '#1e293b' }} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ color: '#334155', fontSize: 11, alignSelf: 'center', marginRight: 2 }}>Franchise</span>
                {FRANCHISE_FORMATS.map(fmt => (
                  <Chip key={fmt} label={FORMAT_LABELS[fmt]} active={selectedFormat === fmt}
                    onClick={() => handleFormatChange(fmt)} color="#f59e0b" />
                ))}
              </div>
            </div>
          </div>

          {/* Role chips */}
          <div style={{ marginBottom: 16 }}>
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

          {/* Team filter + Player search/dropdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Team filter (optional) */}
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 6 }}>
                Team <span style={{ color: '#334155' }}>(optional filter)</span>
              </div>
              <Select
                value={selectedTeam}
                onChange={handleTeamChange}
                options={teamsLoading ? [] : filteredTeams.map(t => t.name)}
                placeholder={
                  !selectedFormat
                    ? 'Select competition first'
                    : teamsLoading
                    ? 'Loading...'
                    : `All ${FORMAT_LABELS[selectedFormat as Format]} teams`
                }
                disabled={!selectedFormat || teamsLoading}
              />
            </div>

            {/* Player — dropdown when team selected, search otherwise */}
            <div>
              <div style={{ color: '#475569', fontSize: 11, marginBottom: 6 }}>Player</div>

              {showTeamPlayerDropdown ? (
                <Select
                  value={selectedPlayer}
                  onChange={handlePlayerChange}
                  options={players}
                  placeholder={playersLoading ? 'Loading...' : players.length === 0 ? 'No players found' : 'Select a player...'}
                  disabled={playersLoading}
                />
              ) : (
                <div ref={searchRef} style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => handleSearchInput(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                    placeholder={
                      !canSearch
                        ? 'Select competition & role first'
                        : selectedTeam
                        ? 'Select role first'
                        : 'Search player by name...'
                    }
                    disabled={!canSearch}
                    style={{
                      width: '100%',
                      background: '#111827',
                      border: `1px solid ${showDropdown && searchResults.length ? '#22c55e44' : '#1e293b'}`,
                      color: '#f1f5f9',
                      borderRadius: showDropdown && (searchResults.length || (searchQuery.length >= 2 && !searchLoading)) ? '8px 8px 0 0' : 8,
                      padding: '9px 14px',
                      fontSize: 14,
                      outline: 'none',
                      boxSizing: 'border-box',
                      opacity: !canSearch ? 0.5 : 1,
                      cursor: !canSearch ? 'not-allowed' : 'text',
                    }}
                  />

                  {showDropdown && searchQuery.length >= 2 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#1a2438',
                      border: '1px solid #1e293b',
                      borderTop: 'none',
                      borderRadius: '0 0 8px 8px',
                      maxHeight: 260,
                      overflowY: 'auto',
                      zIndex: 200,
                    }}>
                      {searchLoading && (
                        <div style={{ padding: '10px 14px', color: '#475569', fontSize: 13 }}>Searching...</div>
                      )}
                      {!searchLoading && searchResults.length === 0 && (
                        <div style={{ padding: '10px 14px', color: '#475569', fontSize: 13 }}>No players found</div>
                      )}
                      {searchResults.map((r, i) => (
                        <div
                          key={i}
                          onMouseDown={() => handleSearchSelect(r)}
                          style={{
                            padding: '9px 14px',
                            cursor: 'pointer',
                            borderBottom: i < searchResults.length - 1 ? '1px solid #0f172a' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 500 }}>{r.name}</span>
                          <span style={{ color: '#475569', fontSize: 12, marginLeft: 12, whiteSpace: 'nowrap' }}>
                            {r.team} · {FORMAT_LABELS[r.format as Format] ?? r.format}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active filters summary */}
          {(selectedFormat || selectedRole || selectedTeam || selectedPlayer) && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#334155', fontSize: 11 }}>Active:</span>
              {selectedFormat && (
                <span style={{ background: '#22c55e15', border: '1px solid #22c55e33', color: '#22c55e', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                  {FORMAT_LABELS[selectedFormat as Format]}
                </span>
              )}
              {selectedRole && (
                <span style={{ background: '#3b82f615', border: '1px solid #3b82f633', color: '#3b82f6', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                  {selectedRole}
                </span>
              )}
              {selectedTeam && (
                <span style={{ background: '#f59e0b15', border: '1px solid #f59e0b33', color: '#f59e0b', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                  {selectedTeam}
                </span>
              )}
              {selectedPlayer && (
                <span style={{ background: '#8b5cf615', border: '1px solid #8b5cf633', color: '#8b5cf6', borderRadius: 6, padding: '2px 8px', fontSize: 11 }}>
                  {selectedPlayer}
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedFormat('');
                  setSelectedRole('');
                  setSelectedTeam('');
                  setSelectedPlayer('');
                  setSearchQuery('');
                }}
                style={{ marginLeft: 4, background: 'none', border: 'none', color: '#475569', fontSize: 11, cursor: 'pointer', padding: '2px 6px' }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content area */}
        {!selectedPlayer && !dataLoading && (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏏</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              Explore Cricket Tendencies
            </h2>
            <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Pick a competition and role, then search for any player by name — or filter by team first.
              Covers Tests, ODIs, T20Is, IPL, BBL, and PSL.
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
