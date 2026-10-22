import { Reveal } from "./Reveal";

/** Every section opens the same way: a title, one line on what the section is for, and at most one action. */
export function SectionHeader({
  id,
  title,
  intro,
  action,
  align = "left",
}: {
  id?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <Reveal className={`flex flex-wrap items-end justify-between gap-6 ${center ? "flex-col items-center text-center" : ""}`}>
      <div className={center ? "flex flex-col items-center" : ""}>
        <h2 id={id} className="section-title max-w-[18ch]">
          {title}
        </h2>
        {intro && <p className={`reading mt-4 max-w-[40rem] ${center ? "mx-auto" : ""}`}>{intro}</p>}
      </div>
      {action}
    </Reveal>
  );
}
