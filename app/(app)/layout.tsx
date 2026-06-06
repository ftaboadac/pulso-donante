import { AppChrome } from "@/components/app-chrome";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppChrome>{children}</AppChrome>;
}
