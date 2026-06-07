import { followUpStatusLabels, getRiskReasons } from "@/lib/donors";
import type { Donor, PaymentStatus } from "@/types/donor";

const exportColumns = [
  "Donante",
  "Celular",
  "Aporte actual",
  "Estado último cobro",
  "Último pago",
  "Último contacto",
  "Área de impacto",
  "Estado seguimiento",
  "Motivos detectados",
];

const exampleColumns = [
  "Donante",
  "Celular",
  "Aporte actual",
  "Estado último cobro",
  "Último pago",
  "Último contacto",
  "Área de impacto",
];

const paymentStatusExportLabels: Record<PaymentStatus, string> = {
  paid: "OK",
  failed: "Rechazado",
  pending: "Pendiente",
  unknown: "Vacío",
};

export function exportDonorsForImport(donors: Donor[]) {
  const rows = donors.map((donor) => [
    donor.name,
    donor.phone,
    donor.monthlyAmount,
    paymentStatusExportLabels[donor.paymentStatus],
    donor.lastPaymentDate,
    donor.lastImpactContactDate,
    donor.cause,
    followUpStatusLabels[donor.followUpStatus],
    getRiskReasons(donor).join(" · ") || "Sin alertas activas",
  ]);
  downloadExcelHtml(`pulso-donante-${formatExportDate()}.xls`, [exportColumns, ...rows]);
}

export function exportExampleSpreadsheet(donors: Donor[]) {
  const rows = donors.map((donor) => [
    donor.name,
    donor.phone,
    donor.monthlyAmount,
    paymentStatusExportLabels[donor.paymentStatus],
    donor.lastPaymentDate,
    donor.lastImpactContactDate,
    donor.cause,
  ]);

  downloadExcelHtml(`fundacion-puente-donantes-demo-${formatExportDate()}.xls`, [exampleColumns, ...rows]);
}

function downloadExcelHtml(filename: string, rows: Array<Array<string | number>>) {
  const html = buildExcelHtml(rows);
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function buildExcelHtml(rows: Array<Array<string | number>>) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; }
      th { background: #d9f4f2; color: #0f4f4c; font-weight: 700; }
      th, td { border: 1px solid #b7d7d5; padding: 6px 8px; text-align: left; vertical-align: top; }
      td.amount { mso-number-format: "0"; text-align: right; }
      td.text { mso-number-format: "\\@"; }
    </style>
  </head>
  <body>
    <table>
      ${rows
        .map((row, rowIndex) => {
          const tag = rowIndex === 0 ? "th" : "td";

          return `<tr>${row
            .map((value, columnIndex) => {
              const className = rowIndex > 0 && columnIndex === 2 ? "amount" : "text";
              return `<${tag} class="${className}">${escapeHtml(String(value))}</${tag}>`;
            })
            .join("")}</tr>`;
        })
        .join("")}
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatExportDate() {
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
