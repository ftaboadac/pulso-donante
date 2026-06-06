import { notFound } from "next/navigation";

import { DonorDetail } from "@/components/donor-detail";
import { donorsSeed } from "@/lib/donors";

export function generateStaticParams() {
  return donorsSeed.map((donor) => ({ id: donor.id }));
}

export default async function DonorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donor = donorsSeed.find((item) => item.id === id);

  if (!donor) {
    notFound();
  }

  return <DonorDetail donor={donor} />;
}
