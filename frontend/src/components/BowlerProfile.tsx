import type { BowlerData } from '../types/cricket';
import { FORMAT_LABELS } from '../types/cricket';
import StatCard from './StatCard';
import PitchMap from './PitchMap';
import PhaseChart from './PhaseChart';
import DismissalChart from './DismissalChart';
import { useState } from 'react';

interface Props { data: BowlerData; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 32 }}>
    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 16, borderLeft: '3px solid #3b82f6', paddingLeft: 10 }}>
      {title}
    </h3>
    {children}
  </div>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, ...style }}>
    {children}
  </div>
);

type PitchMetric = 'balls' | 'wickets' | 'economy';

export default function BowlerProfile({ data }: Props) {
  const [pitchMetric, setPitchMetric] = useState<PitchMetric>('balls');
  const { stats, phases, wicket_types, pitch_map, vs_rhb, vs_lhb } = data;

  const totalWickets = Object.values(wicket_types).reduce((s, v) => s + v, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1 }}>{data.name}</h2>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            {data.team} · {FORMAT_LABELS[data.format]} · Bowler
          </div>
        </div>
      </div>

      {/* Core stats */}
      <Section title="Career Overview">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          <StatCard label="Wickets" value={stats.wickets} color="#3b82f6" delay={0} />
          <StatCard label="Economy" value={stats.economy} color="#22c55e" delay={100} />
          <StatCard label="Average" value={stats.average ?? 0} color="#f59e0b" delay={200} />
          <StatCard label="Strike Rate" value={stats.strike_rate ?? 0} color="#ec4899" delay={300} />
          <StatCard label="Overs" value={stats.overs} color="#8b5cf6" delay={400} />
          <StatCard label="Runs" value={stats.runs_conceded} color="#14b8a6" delay={500} />
        </div>
      </Section>

      {/* Pitch Map */}
      <Section title="Line & Length Heatmap">
        <Card>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {(['balls', 'wickets', 'economy'] as PitchMetric[]).map(m => (
              <button
                key={m}
                onClick={() => setPitchMetric(m)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  background: pitchMetric === m ? '#3b82f6' : '#1a2438',
                  color: pitchMetric === m ? '#fff' : '#64748b',
                  transition: 'all 0.15s',
                }}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          <PitchMap cells={pitch_map} metric={pitchMetric} />
          <div style={{ color: '#475569', fontSize: 11, marginTop: 8 }}>
            Showing {pitchMetric} per zone · Yellow dashed outline = pitch area
          </div>
        </Card>
      </Section>

      {/* Economy / Wickets / Average by phase */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Economy by Phase
          </h3>
          <PhaseChart phases={phases} metric="economy" label="Economy" color="#3b82f6" benchmarkLine={stats.economy} />
        </Card>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Wickets by Phase
          </h3>
          <PhaseChart phases={phases} metric="wickets" label="Wickets" color="#22c55e" />
        </Card>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Average by Phase
          </h3>
          <PhaseChart phases={phases} metric="average" label="Average" color="#f59e0b" benchmarkLine={stats.average ?? undefined} />
        </Card>
      </div>

      {/* Wicket types + vs handedness */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Wicket Types
          </h3>
          <DismissalChart dismissals={wicket_types} />
        </Card>

        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            vs Batter Handedness
          </h3>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            {[
              { label: 'vs Right-Handed', data: vs_rhb, color: '#3b82f6' },
              { label: 'vs Left-Handed', data: vs_lhb, color: '#f59e0b' },
            ].map(({ label, data: d, color }) => (
              <div key={label} style={{ flex: 1, background: '#0f172a', borderRadius: 10, padding: 16 }}>
                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, marginBottom: 12 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: "'Bebas Neue', sans-serif" }}>
                  Eco {d.economy}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                  {d.wickets} wickets ({totalWickets > 0 ? ((d.wickets / totalWickets) * 100).toFixed(0) : 0}%)
                </div>
                {/* Bar */}
                <div style={{ height: 6, background: '#1e293b', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: color,
                    borderRadius: 3,
                    width: `${totalWickets > 0 ? (d.wickets / totalWickets) * 100 : 0}%`,
                    transition: 'width 0.8s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 10 }}>Economy Comparison</h4>
            {[{ label: 'vs RHB', val: vs_rhb.economy, color: '#3b82f6', max: Math.max(vs_rhb.economy, vs_lhb.economy) + 1 },
              { label: 'vs LHB', val: vs_lhb.economy, color: '#f59e0b', max: Math.max(vs_rhb.economy, vs_lhb.economy) + 1 }
            ].map(({ label, val, color, max }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 50, color: '#64748b', fontSize: 11 }}>{label}</div>
                <div style={{ flex: 1, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: color, borderRadius: 4, width: `${(val / max) * 100}%`, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ width: 36, color, fontSize: 12, fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
