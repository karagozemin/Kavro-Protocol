import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { AuditLookup } from "@/components/deals/audit-lookup";

export default function AuditorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Auditor Dashboard"
        title="Auditor Agent Console"
        description="Verify permissioned 0G Storage disclosures, run compliance summaries through 0G Compute, and inspect on-chain proof events without public leakage."
      />
      <DealList mode="auditor" />
      <AuditLookup />
    </div>
  );
}
