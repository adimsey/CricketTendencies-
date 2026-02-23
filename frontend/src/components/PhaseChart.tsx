import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import type { PhaseStats } from '../types/cricket';
import { PHASE_LABELS } from '../types/cricket';

interface Props {
  phases: Record<string, PhaseStats>;
  metric: 'strike_rate' | 'average' | 'economy' | 'boundary_pct' | 'dot_pct' | 'wickets';
  label: string;
  color?: string;
  benchmarkLine?: number;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function PhaseChart({ phases, metric, label, color = '#22c55e', benchmarkLine }: Props) {
  const data = Object.entries(phases)
    .filter(([, v]) => v[metric] !== undefined)
    .map(([phase, v], i) => ({
      phase: PHASE_LABELS[phase] ?? phase,
      value: v[metric] as number,
      color: COLORS[i % COLORS.length],
    }));

  if (!data.length) return null;

  const CustomTooltip = ({ active, payload, label: l }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#1a2438', border: '1px solid #1e293b', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{l}</div>
        <div style={{ color: color, fontWeight: 700, fontSize: 16 }}>{payload[0].value?.toFixed(2)}</div>
        <div style={{ color: '#64748b', fontSize: 11 }}>{label}</div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }} barSize={36}>
          <CartesianGrid vertical={false} stroke="#1e293b" />
          <XAxis dataKey="phase" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          {benchmarkLine && (
            <ReferenceLine y={benchmarkLine} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'avg', fill: '#f59e0b', fontSize: 10 }} />
          )}
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
