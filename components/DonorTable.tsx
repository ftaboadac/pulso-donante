import Link from "next/link";

import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getDonorRisk } from "@/lib/donors";
import type { Donor } from "@/types/donor";

export function DonorTable({ donors }: { donors: Donor[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary">
              {["Donante", "Monto", "Riesgo", "Motivo", "Estado seguimiento", "Acción"].map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donors.map((donor) => {
              const risk = getDonorRisk(donor);

              return (
                <tr key={donor.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-medium text-foreground">{donor.name}</p>
                    <p className="text-xs text-muted-foreground">{donor.cause}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                    {formatCurrency(donor.monthlyAmount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <RiskBadge donor={donor} />
                  </td>
                  <td className="max-w-sm px-4 py-3 text-muted-foreground">
                    <span className="line-clamp-2">{risk.reasons.join(" · ") || "Sin alertas activas"}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={donor.followUpStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/donor/${donor.id}`}>Ver caso</Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
            {donors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No hay donantes para este filtro.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
