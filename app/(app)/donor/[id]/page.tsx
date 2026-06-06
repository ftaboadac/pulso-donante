import { DonorDetail } from "@/components/donor-detail";
import { donorsSeed } from "@/lib/donors";

export const dynamicParams = true;

export function generateStaticParams() {
  return donorsSeed.map((donor) => ({ id: donor.id }));
}

export default async function DonorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seedDonor = donorsSeed.find((item) => item.id === id) ?? null;

  return <DonorDetail donorId={id} initialDonor={seedDonor} />;
}
