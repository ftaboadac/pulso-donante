import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, getDonorRisk } from "@/lib/donors";
import type { Donor } from "@/types/donor";

export function DonorTable({
  donors,
  title,
  description,
}: {
  donors: Donor[];
  title: string;
  description: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="divide-y divide-border md:hidden">
        {donors.map((donor) => {
          const risk = getDonorRisk(donor);

          return (
            <Link key={donor.id} href={`/donor/${donor.id}`} className="block p-4 transition-colors hover:bg-secondary/40">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{donor.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatPhone(donor.phone)}</p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RiskBadge donor={donor} />
                <StatusBadge status={donor.followUpStatus} />
                <span className="text-sm font-semibold text-foreground">{formatCurrency(donor.monthlyAmount)}</span>
              </div>
              <ReasonList reasons={risk.reasons} className="mt-3" />
            </Link>
          );
        })}
        {donors.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No hay donantes en esta vista.</p>
        ) : null}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary">
              {["Donante", "Aporte mensual", "Riesgo", "Motivo", "Seguimiento"].map((column) => (
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
                    <Link
                      href={`/donor/${donor.id}`}
                      className="group inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {donor.name}
                      <ArrowRight className="size-3.5 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{formatPhone(donor.phone)}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                    {formatCurrency(donor.monthlyAmount)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <RiskBadge donor={donor} />
                  </td>
                  <td className="max-w-md px-4 py-3 text-muted-foreground">
                    <ReasonList reasons={risk.reasons} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={donor.followUpStatus} />
                  </td>
                </tr>
              );
            })}
            {donors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No hay donantes en esta vista.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatPhone(phone: string) {
  return phone.replace(/^(\+54)(9)(\d{2})(\d{4})(\d{4})$/, "$1 $2 $3 $4 $5");
}

function ReasonList({ reasons, className }: { reasons: string[]; className?: string }) {
  if (reasons.length === 0) {
    return <span className={className}>Sin alertas activas</span>;
  }

  return (
    <ul className={className ? `${className} space-y-1.5 text-sm text-muted-foreground` : "space-y-1.5"}>
      {reasons.slice(0, 2).map((reason) => (
        <li key={reason} className="leading-5">
          {reason}
        </li>
      ))}
      {reasons.length > 2 ? (
        <li className="text-xs text-muted-foreground/80">También tiene {reasons.length - 2} alerta más.</li>
      ) : null}
    </ul>
  );
}
