import type { Metadata } from "next";
import { connection } from "next/server";
import { GateConsole } from "@/components/gate/GateConsole";
import { GateLogin } from "@/components/gate/GateLogin";
import { gateConfigured, isStaff } from "@/lib/epass/gate";

export const metadata: Metadata = {
  title: "Gate check-in",
  robots: { index: false, follow: false },
};

export default async function GatePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await connection();
  const { next } = await searchParams;
  if (!(await isStaff())) return <GateLogin configured={gateConfigured()} next={next} />;
  return <GateConsole />;
}
