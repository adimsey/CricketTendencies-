import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

interface VsEntry {
  subject: string;
  value: number;
  fullMark: number;
}

interface Props {
  data: VsEntry[];
  color?: string;
  label?: string;
}

export default function VsTypeChart({ data, color = '#22c55e', label = 'Value' }: Props) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#1a2438', border: '1px solid #1e293b', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ color: '#94a3b8', fontSize: 12 }}>{payload[0]?.payload?.subject}</div>
        <div style={{ color: color, fontWeight: 700 }}>{payload[0]?.value?.toFixed(1)}</div>
        <div style={{ color: '#64748b', fontSize: 11 }}>{label}</div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
        <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: color }} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
