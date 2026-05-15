import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { IdentityStatus } from "@/components/deals/identity-status";
import { Card } from "@/components/ui/card";

export default function InvestorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Investor Dashboard"
        title="Investor Agent Console"
        description="Run 0G Compute due diligence, store private bid context on 0G Storage, submit sealed commitments, and request claims after repayment."
      />
      <IdentityStatus />
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Investor Agent</p>
        <p className="mt-2 text-sm text-text-2">Private bid amounts are never written as plaintext. The public chain receives only commitment hashes and encrypted storage references.</p>
      </Card>
      <DealList mode="investor" />
    </div>
  );
}
