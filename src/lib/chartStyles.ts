export const chartStyles = {
  grid: { stroke: 'var(--color-chart-grid)' },
  tooltip: {
    contentStyle: {
      backgroundColor: 'var(--color-chart-tooltip-bg)',
      border: '1px solid var(--color-chart-tooltip-border)',
      borderRadius: '8px',
      fontSize: '12px',
    },
    labelStyle: { color: 'var(--color-text-secondary)' },
  },
  axisTick: { fill: 'var(--color-text-muted)', fontSize: 11 },
  axisTickSm: { fill: 'var(--color-text-muted)', fontSize: 10 },
}
