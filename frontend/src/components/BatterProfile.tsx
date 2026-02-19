import { useState } from 'react';
import type { BatterData } from '../types/cricket';
import { FORMAT_LABELS } from '../types/cricket';
import StatCard from './StatCard';
import WagonWheel from './WagonWheel';
import PhaseChart from './PhaseChart';
import DismissalChart from './DismissalChart';
import VsTypeChart from './VsTypeChart';

interface Props { data: BatterData; }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 32 }}>
    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#475569', marginBottom: 16, borderLeft: '3px solid #22c55e', paddingLeft: 10 }}>
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

export default function BatterProfile({ data }: Props) {
  const [pitchMetric] = useState<'strike_rate' | 'average'>('strike_rate');
  const { stats, phases, dismissals_breakdown, wagon_wheel, vs_pace, vs_spin, vs_left_arm, vs_right_arm } = data;

  const vsRadarData = [
    { subject: 'vs Pace SR', value: vs_pace.strike_rate, fullMark: 200 },
    { subject: 'vs Spin SR', value: vs_spin.strike_rate, fullMark: 200 },
    { subject: 'vs Left SR', value: vs_left_arm.strike_rate, fullMark: 200 },
    { subject: 'vs Right SR', value: vs_right_arm.strike_rate, fullMark: 200 },
    { subject: 'vs Pace Avg', value: vs_pace.average, fullMark: 100 },
    { subject: 'vs Spin Avg', value: vs_spin.average, fullMark: 100 },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1 }}>{data.name}</h2>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
            {data.team} · {FORMAT_LABELS[data.format]} · Batter
          </div>
        </div>
      </div>

      {/* Core stats */}
      <Section title="Career Overview">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          <StatCard label="Runs" value={stats.runs} color="#22c55e" delay={0} />
          <StatCard label="Average" value={stats.average} color="#3b82f6" delay={100} />
          <StatCard label="Strike Rate" value={stats.strike_rate} color="#f59e0b" delay={200} />
          <StatCard label="100s" value={stats.hundreds} color="#ec4899" delay={300} />
          <StatCard label="50s" value={stats.fifties} color="#8b5cf6" delay={400} />
          <StatCard label="Fours" value={stats.fours} color="#14b8a6" delay={500} />
          <StatCard label="Sixes" value={stats.sixes} color="#f97316" delay={600} />
          <StatCard label="Boundary %" value={stats.boundary_pct} suffix="%" color="#06b6d4" delay={700} />
          <StatCard label="Dot Ball %" value={stats.dot_pct} suffix="%" color="#84cc16" delay={800} />
        </div>
      </Section>

      {/* Wagon Wheel + Phase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 16 }}>
            Wagon Wheel — Scoring Zones
          </h3>
          <WagonWheel zones={wagon_wheel} animated />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
              Strike Rate by Phase
            </h3>
            <PhaseChart phases={phases} metric="strike_rate" label="Strike Rate" color="#22c55e" benchmarkLine={stats.strike_rate} />
          </Card>
          <Card>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
              Average by Phase
            </h3>
            <PhaseChart phases={phases} metric="average" label="Average" color="#3b82f6" benchmarkLine={stats.average} />
          </Card>
        </div>
      </div>

      {/* Boundary + Dot % by phase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Boundary % by Phase
          </h3>
          <PhaseChart phases={phases} metric="boundary_pct" label="Boundary %" color="#f59e0b" />
        </Card>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Dot Ball % by Phase
          </h3>
          <PhaseChart phases={phases} metric="dot_pct" label="Dot Ball %" color="#ef4444" />
        </Card>
      </div>

      {/* Dismissals + vs type */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            Dismissal Types
          </h3>
          <DismissalChart dismissals={dismissals_breakdown} />
        </Card>

        <Card>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', marginBottom: 12 }}>
            vs Bowling Type (Strike Rate)
          </h3>
          <VsTypeChart data={vsRadarData} color="#22c55e" label="Strike Rate / Average" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            {[
              { label: 'vs Pace', avg: vs_pace.average, sr: vs_pace.strike_rate },
              { label: 'vs Spin', avg: vs_spin.average, sr: vs_spin.strike_rate },
              { label: 'vs Left Arm', avg: vs_left_arm.average, sr: vs_left_arm.strike_rate },
              { label: 'vs Right Arm', avg: vs_right_arm.average, sr: vs_right_arm.strike_rate },
            ].map(({ label, avg, sr }) => (
              <div key={label} style={{ background: '#0f172a', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600 }}>{label}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>Avg {avg}</span>
                  <span style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700 }}>SR {sr}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
