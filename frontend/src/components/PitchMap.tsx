import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { PitchMapCell } from '../types/cricket';

interface Props {
  cells: PitchMapCell[];
  metric?: 'balls' | 'wickets' | 'economy';
}

const LENGTH_ORDER = ['full_toss', 'yorker', 'full', 'good', 'short_of_good', 'short'];
const LINE_ORDER = ['wide_outside_off', 'outside_off', 'off_stump', 'middle_stump', 'leg_stump', 'outside_leg'];

const LENGTH_LABELS: Record<string, string> = {
  full_toss: 'Full Toss',
  yorker: 'Yorker',
  full: 'Full',
  good: 'Good Length',
  short_of_good: 'Back of Length',
  short: 'Short',
};
const LINE_LABELS: Record<string, string> = {
  wide_outside_off: 'Wide Off',
  outside_off: 'Out. Off',
  off_stump: 'Off',
  middle_stump: 'Mid',
  leg_stump: 'Leg',
  outside_leg: 'Out. Leg',
};

export default function PitchMap({ cells, metric = 'balls' }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !cells.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cellW = 52, cellH = 38;
    const marginLeft = 80, marginTop = 30, marginBottom = 20;
    const W = marginLeft + LINE_ORDER.length * cellW + 10;
    const H = marginTop + LENGTH_ORDER.length * cellH + marginBottom;

    svg.attr('width', W).attr('height', H);

    const vals = cells.map(c => c[metric]);
    const maxVal = d3.max(vals) ?? 1;
    const minVal = d3.min(vals) ?? 0;

    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(
        metric === 'wickets'
          ? d3.interpolateRgb('#0f172a', '#22c55e')
          : metric === 'economy'
          ? d3.interpolateRgb('#0f172a', '#ef4444')
          : d3.interpolateRgb('#0f172a', '#3b82f6')
      );

    const g = svg.append('g').attr('transform', `translate(${marginLeft},${marginTop})`);

    // Column headers (lines)
    LINE_ORDER.forEach((line, j) => {
      g.append('text')
        .attr('x', j * cellW + cellW / 2)
        .attr('y', -8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '10px')
        .text(LINE_LABELS[line] ?? line);
    });

    // Row labels (lengths) + pitch visual
    LENGTH_ORDER.forEach((length, i) => {
      g.append('text')
        .attr('x', -8)
        .attr('y', i * cellH + cellH / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '10px')
        .text(LENGTH_LABELS[length] ?? length);

      LINE_ORDER.forEach((line, j) => {
        const cell = cells.find(c => c.length === length && c.line === line);
        if (!cell) return;

        const val = cell[metric];
        const rect = g.append('rect')
          .attr('x', j * cellW + 1)
          .attr('y', i * cellH + 1)
          .attr('width', cellW - 2)
          .attr('height', cellH - 2)
          .attr('rx', 4)
          .attr('fill', colorScale(minVal))
          .attr('stroke', '#1e293b')
          .attr('stroke-width', 0.5);

        rect.transition()
          .delay((i * LINE_ORDER.length + j) * 15)
          .duration(400)
          .attr('fill', colorScale(val));

        g.append('text')
          .attr('x', j * cellW + cellW / 2)
          .attr('y', i * cellH + cellH / 2 - 6)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', val > (maxVal * 0.5) ? '#fff' : '#64748b')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .attr('opacity', 0)
          .text(metric === 'economy' ? val.toFixed(1) : val)
          .transition().delay((i * LINE_ORDER.length + j) * 15 + 300).duration(200).attr('opacity', 1);

        // Secondary stat
        const secondary = metric === 'balls' ? `${cell.wickets}w` : `${cell.balls}b`;
        g.append('text')
          .attr('x', j * cellW + cellW / 2)
          .attr('y', i * cellH + cellH / 2 + 8)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', '#475569')
          .attr('font-size', '9px')
          .attr('opacity', 0)
          .text(secondary)
          .transition().delay((i * LINE_ORDER.length + j) * 15 + 300).duration(200).attr('opacity', 1);
      });
    });

    // Pitch outline
    const pitchX = 2 * cellW + 1;
    const pitchW = 2 * cellW - 2;
    const pitchY = 1;
    const pitchH = LENGTH_ORDER.length * cellH - 2;
    g.append('rect')
      .attr('x', pitchX).attr('y', pitchY)
      .attr('width', pitchW).attr('height', pitchH)
      .attr('rx', 4)
      .attr('fill', 'none')
      .attr('stroke', '#fbbf24')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,2')
      .attr('opacity', 0.5);

  }, [cells, metric]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg ref={svgRef} />
    </div>
  );
}
