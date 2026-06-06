import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { TerminalCard, TerminalCardHeader } from '@/components/terminal/TerminalCard'
import { OrderTicket } from '@/components/terminal/OrderTicket'
import { OpenPositionsTable } from '@/components/terminal/OpenPositionsTable'
import { DataTable } from '@/components/ui/DataTable'
import { StatusBadge } from '@/components/ui/Badge'
import { PerformanceChart } from '@/components/terminal/PerformanceChart'
import { paperTrades, paperAccount, paperPositions, portfolioHistory } from '@/data/mockData'
import { formatCurrency, formatPercent, formatDateTime } from '@/lib/utils'
import { FlaskConical, TrendingUp, Wallet, BarChart3 } from 'lucide-react'

export function PaperTradingPage() {
  return (
    <div className="terminal-grid space-y-6">
      <PageHeader
        title="Paper Trading"
        description="Simulated execution environment — zero capital risk"
        action={
          <div className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/5 px-3 py-1.5">
            <FlaskConical className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-accent">SIMULATION ACTIVE</span>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          variant="terminal"
          label="Account Equity"
          value={formatCurrency(paperAccount.equity)}
          change={`${formatPercent(paperAccount.dayPnLPercent)} today`}
          changeValue={paperAccount.dayPnLPercent}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="Cash Balance"
          value={formatCurrency(paperAccount.balance)}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="Day P&L"
          value={formatCurrency(paperAccount.dayPnL)}
          change={formatPercent(paperAccount.dayPnLPercent)}
          changeValue={paperAccount.dayPnL}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <StatCard
          variant="terminal"
          label="Margin Available"
          value={formatCurrency(paperAccount.marginAvailable)}
          change={`Used: ${formatCurrency(paperAccount.marginUsed)}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PerformanceChart data={portfolioHistory.slice(-12).map((d, i) => ({
            ...d,
            value: 100_000 + i * 700 + (d.value - 280_000) * 0.3,
            benchmark: 100_000 + i * 500,
          }))} />
        </div>
        <OrderTicket />
      </div>

      <OpenPositionsTable
        positions={paperPositions.map((p) => ({
          ...p,
          sector: 'Paper',
        }))}
        title="Paper Positions"
        description={`${paperPositions.length} open simulated positions`}
        compact
      />

      <TerminalCard padding="none">
        <div className="border-b border-border-subtle p-5">
          <TerminalCardHeader
            title="Order History"
            description="Recent paper trade executions"
          />
        </div>
        <DataTable
          data={paperTrades}
          keyExtractor={(t) => t.id}
          columns={[
            {
              key: 'timestamp',
              header: 'Time',
              render: (t) => (
                <span className="font-mono text-xs text-text-secondary">
                  {formatDateTime(t.timestamp)}
                </span>
              ),
            },
            {
              key: 'symbol',
              header: 'Symbol',
              render: (t) => <span className="font-bold text-ai">{t.symbol}</span>,
            },
            {
              key: 'side',
              header: 'Side',
              render: (t) => <StatusBadge status={t.side} />,
            },
            {
              key: 'quantity',
              header: 'Qty',
              align: 'right',
              render: (t) => <span className="font-mono">{t.quantity}</span>,
            },
            {
              key: 'price',
              header: 'Fill Price',
              align: 'right',
              render: (t) => <span className="font-mono">{formatCurrency(t.price)}</span>,
            },
            {
              key: 'total',
              header: 'Total',
              align: 'right',
              render: (t) => (
                <span className="font-mono font-medium">
                  {formatCurrency(t.quantity * t.price)}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              align: 'right',
              render: (t) => <StatusBadge status={t.status} />,
            },
          ]}
        />
      </TerminalCard>
    </div>
  )
}
