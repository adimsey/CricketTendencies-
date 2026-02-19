import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  dismissals: Record<string, number>;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function DismissalChart({ dismissals }: Props) {
  const data = Object.entries(dismissals)
    .map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    return (
      <div style={{ background: '#1a2438', border: '1px solid #1e293b', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ color: payload[0].fill, fontWeight: 700 }}>{name}</div>
        <div style={{ color: '#94a3b8', fontSize: 13 }}>{value} ({((value / total) * 100).toFixed(1)}%)</div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>}
          iconSize={8}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
