import { SectionHeading } from "@/components/section-heading";
import { IdentityAdmin } from "@/components/deals/identity-admin";

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Admin"
        title="Identity Registry"
        description="Manual KYC registry management for production-style admin flows. Demo testers do not need this page — the hackathon build uses mock KYC on the Investor route instead of manual whitelisting."
      />
      <IdentityAdmin />
    </div>
  );
}
