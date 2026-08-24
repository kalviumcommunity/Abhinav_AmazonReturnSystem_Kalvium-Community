import ProtectedLayout from "@/app/components/ProtectedLayout";

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
