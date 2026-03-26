"use client";

import { useRouter } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import RegionCard from "@/components/ui/RegionCard";
import Button from "@/components/ui/Button";
import { regions } from "../data/regions";

export default function SelectRegionPage() {
  const router = useRouter();

  const isSingleRegion = regions.length === 1;

  return (
    <PageContainer className="pt-[64px] pb-[64px]">
      <div className="flex flex-col gap-[32px]">
        <Button
          variant="text"
          onClick={() => router.push("/")}
        >
          BACK
        </Button>

        <div className="flex flex-col items-center gap-[4px]">
          <h1 className="h1 text-[var(--text-primary)]">
            Choose Your Region
          </h1>
        </div>

        {isSingleRegion ? (
          <div className="flex justify-center">
            <RegionCard
              region={regions[0]}
              onClick={() => router.push(`/teams/${regions[0].id}`)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 justify-items-center gap-[16px]">
            {regions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                onClick={() => router.push(`/teams/${region.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}