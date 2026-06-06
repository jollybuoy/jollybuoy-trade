import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { TerminalCard, TerminalCardHeader } from './TerminalCard'
import { cn } from '@/lib/utils'

export function OrderTicket() {
  return (
    <TerminalCard glow="ai">
      <TerminalCardHeader title="Order Ticket" description="Paper trade · No real money" />

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Symbol
          </label>
          <input
            type="text"
            defaultValue="TSLA"
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2.5 font-mono text-sm text-text-primary focus:border-ai/40 focus:outline-none focus:ring-1 focus:ring-ai/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 py-2.5 text-sm font-medium text-accent"
          >
            <ArrowUpCircle className="h-4 w-4" />
            Buy
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border-subtle py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-hover"
          >
            <ArrowDownCircle className="h-4 w-4" />
            Sell
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
              Quantity
            </label>
            <input
              type="number"
              defaultValue={25}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 font-mono text-sm focus:border-ai/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
              Order Type
            </label>
            <select className="mt-1 w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 text-sm focus:border-ai/40 focus:outline-none">
              <option>Market</option>
              <option>Limit</option>
              <option>Stop</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Limit Price
          </label>
          <input
            type="text"
            defaultValue="248.92"
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface/60 px-3 py-2 font-mono text-sm focus:border-ai/40 focus:outline-none"
          />
        </div>

        <div className="rounded-lg border border-border-subtle bg-surface/40 px-3 py-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">Est. Total</span>
            <span className="font-mono font-semibold text-text-primary">$6,223.00</span>
          </div>
          <div className="mt-1 flex justify-between text-xs">
            <span className="text-text-muted">Buying Power</span>
            <span className="font-mono text-accent">$87,550.00</span>
          </div>
        </div>

        <button
          type="button"
          className={cn(
            'w-full rounded-lg py-3 text-sm font-semibold transition-colors',
            'bg-accent text-surface hover:bg-accent-muted',
          )}
        >
          Submit Paper Order
        </button>
      </div>
    </TerminalCard>
  )
}
