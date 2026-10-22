/**
 * Swaps between states of a label without the layout jumping: every state sits in the same grid
 * cell and only the active one is visible (pattern from the Portfolio project's Swap).
 */
export function Swap({ active, states, className = "" }: { active: string; states: Record<string, React.ReactNode>; className?: string }) {
  return (
    <span className={`inline-grid ${className}`} style={{ gridTemplateAreas: '"stack"' }}>
      {Object.entries(states).map(([key, node]) => (
        <span
          key={key}
          aria-hidden={key !== active}
          className="inline-flex items-center justify-center gap-2 transition-[opacity,transform,filter] duration-[var(--d2)] ease-[var(--ease)]"
          style={{
            gridArea: "stack",
            opacity: key === active ? 1 : 0,
            transform: key === active ? "none" : "scale(0.92)",
            filter: key === active ? "none" : "blur(2px)",
          }}
        >
          {node}
        </span>
      ))}
    </span>
  );
}
