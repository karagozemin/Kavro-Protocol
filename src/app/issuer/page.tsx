import { SectionHeading } from "@/components/section-heading";
import { CreateDealForm } from "@/components/deals/create-deal-form";
import { DealList } from "@/components/deals/deal-list";
import { Card } from "@/components/ui/card";

export default function IssuerPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Issuer Dashboard"
        title="Issuer Agent Console"
        description="Create Kavro Rooms, register encrypted deal memory on 0G Storage, run allocation agents, record repayment commitments, and grant permissioned auditor disclosure."
      />
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Issuer Agent</p>
        <p className="mt-2 text-sm text-text-2">The issuer agent publishes public room metadata, keeps sensitive documents in encrypted 0G Storage, and commits lifecycle proofs to 0G Chain.</p>
      </Card>
      <CreateDealForm />
      <DealList mode="issuer" />
    </div>
  );
}
