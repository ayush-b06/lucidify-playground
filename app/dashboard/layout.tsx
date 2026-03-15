import { AuthProvider } from "@/context/authContext";
import DashboardGuard from "@/components/DashboardGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardGuard>
        {children}
      </DashboardGuard>
    </AuthProvider>
  );
}