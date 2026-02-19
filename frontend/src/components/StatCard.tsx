import { useEffect, useRef } from 'react';

interface Props {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
  delay?: number;
  suffix?: string;
  large?: boolean;
}

export default function StatCard({ label, value, sub, color = '#22c55e', delay = 0, suffix = '', large = false }: Props) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof value !== 'number' || !numRef.current) return;
    const el = numRef.current;
    const target = value;
    const duration = 1000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) { requestAnimationFrame(animate); return; }
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const current = ease * target;
      el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(2)).toString() + suffix;
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, delay, suffix]);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: large ? '20px 24px' : '14px 18px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${color}22`; }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
    >
      {/* Accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, opacity: 0.7, borderRadius: '12px 12px 0 0' }} />

      <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: large ? 36 : 26, fontWeight: 700, color, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em', lineHeight: 1 }}>
        {typeof value === 'number'
          ? <span ref={numRef}>0{suffix}</span>
          : value
        }
      </div>
      {sub && <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
