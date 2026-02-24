import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { WagonWheelZone } from '../types/cricket';

interface Props {
  zones: WagonWheelZone[];
  animated?: boolean;
}

const ZONE_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ec4899',
  '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
];

export default function WagonWheel({ zones, animated = true }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !zones.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const size = 340;
    const cx = size / 2;
    const cy = size / 2;
    const R = 145;
    const pitchR = 28;

    const g = svg.append('g');

    // Background rings
    [1, 0.7, 0.4].forEach(r => {
      g.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', R * r)
        .attr('fill', 'none')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1);
    });

    // Field labels
    const fieldLabels = [
      { label: 'Fine Leg', angle: 180 },
      { label: 'Sq Leg', angle: 140 },
      { label: 'Mid-On', angle: 50 },
      { label: 'Mid-Off', angle: -50 },
      { label: 'Cover', angle: -90 },
      { label: 'Point', angle: -130 },
      { label: '3rd Man', angle: -170 },
    ];
    fieldLabels.forEach(({ label, angle }) => {
      const rad = (angle - 90) * (Math.PI / 180);
      g.append('text')
        .attr('x', cx + (R + 12) * Math.cos(rad))
        .attr('y', cy + (R + 12) * Math.sin(rad))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#475569')
        .attr('font-size', '9px')
        .text(label);
    });

    // Pitch rectangle
    g.append('rect')
      .attr('x', cx - 8).attr('y', cy - pitchR)
      .attr('width', 16).attr('height', pitchR * 2)
      .attr('rx', 3)
      .attr('fill', '#854d0e')
      .attr('opacity', 0.6);

    const maxRuns = d3.max(zones, d => d.runs) ?? 1;

    zones.forEach((zone, i) => {
      if (zone.runs === 0) return;
      const color = ZONE_COLORS[i % ZONE_COLORS.length];
      const midDeg = (zone.angle_start + zone.angle_end) / 2;
      const startAngle = (zone.angle_start - 90) * (Math.PI / 180);
      const endAngle = (zone.angle_end - 90) * (Math.PI / 180);
      const lineR = pitchR + (R - pitchR) * Math.sqrt(zone.runs / maxRuns);

      // Fan/wedge
      const arc = d3.arc<{ runs: number }>()
        .innerRadius(pitchR + 2)
        .outerRadius(lineR)
        .startAngle(startAngle)
        .endAngle(endAngle);

      const path = g.append('path')
        .datum(zone)
        .attr('transform', `translate(${cx},${cy})`)
        .attr('d', arc as any)
        .attr('fill', color)
        .attr('opacity', 0.18);

      // Spoke line
      const midAngle = (midDeg - 90) * (Math.PI / 180);
      const line = g.append('line')
        .attr('x1', cx + pitchR * Math.cos(midAngle))
        .attr('y1', cy + pitchR * Math.sin(midAngle))
        .attr('stroke', color)
        .attr('stroke-width', zone.sixes > 0 ? 2.5 : 1.5)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0.85);

      if (animated) {
        const endX = cx + lineR * Math.cos(midAngle);
        const endY = cy + lineR * Math.sin(midAngle);
        line.attr('x2', cx + pitchR * Math.cos(midAngle))
          .attr('y2', cy + pitchR * Math.sin(midAngle));
        path.attr('opacity', 0);

        line.transition().delay(i * 80).duration(600).ease(d3.easeCubicOut)
          .attr('x2', endX).attr('y2', endY);
        path.transition().delay(i * 80 + 200).duration(400)
          .attr('opacity', 0.18);

        // Dot at tip
        const dot = g.append('circle')
          .attr('cx', cx + pitchR * Math.cos(midAngle))
          .attr('cy', cy + pitchR * Math.sin(midAngle))
          .attr('r', zone.sixes > 0 ? 5 : 3.5)
          .attr('fill', color)
          .attr('opacity', 0);

        dot.transition().delay(i * 80 + 500).duration(300)
          .attr('cx', endX).attr('cy', endY).attr('opacity', 1);

        // Runs label
        if (zone.runs > 0) {
          const labelR = lineR + 10;
          g.append('text')
            .attr('x', cx + labelR * Math.cos(midAngle))
            .attr('y', cy + labelR * Math.sin(midAngle))
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', color)
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .attr('opacity', 0)
            .text(zone.runs)
            .transition().delay(i * 80 + 600).duration(300).attr('opacity', 1);
        }
      } else {
        const endX = cx + lineR * Math.cos(midAngle);
        const endY = cy + lineR * Math.sin(midAngle);
        line.attr('x2', endX).attr('y2', endY);
        g.append('circle').attr('cx', endX).attr('cy', endY)
          .attr('r', zone.sixes > 0 ? 5 : 3.5).attr('fill', color);
      }
    });

    // Centre stumps
    [-4, 0, 4].forEach(offset => {
      g.append('line')
        .attr('x1', cx + offset).attr('y1', cy - pitchR + 4)
        .attr('x2', cx + offset).attr('y2', cy + pitchR - 4)
        .attr('stroke', '#fbbf24').attr('stroke-width', 1.5);
    });

  }, [zones, animated]);

  const totalRuns = zones.reduce((s, z) => s + z.runs, 0);
  const totalFours = zones.reduce((s, z) => s + z.fours, 0);
  const totalSixes = zones.reduce((s, z) => s + z.sixes, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg ref={svgRef} width={340} height={340} style={{ overflow: 'visible' }} />
      <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#94a3b8' }}>
        <span><b style={{ color: '#22c55e' }}>{totalRuns}</b> runs</span>
        <span><b style={{ color: '#3b82f6' }}>{totalFours}</b> fours</span>
        <span><b style={{ color: '#f59e0b' }}>{totalSixes}</b> sixes</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 320 }}>
        {zones.map((z, i) => (
          <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ZONE_COLORS[i % ZONE_COLORS.length] }} />
            {z.zone.replace('_', ' ')} {z.runs}
          </div>
        ))}
      </div>
    </div>
  );
}
