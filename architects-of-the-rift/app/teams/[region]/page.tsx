"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import Button from "@/components/ui/Button";
import TeamCard from "@/components/ui/TeamCard";
import Dialog from "@/components/ui/Dialog";
import { teams } from "@/app/data/teams";
import type { Team } from "@/app/types/team";

export default function TeamsPage() {
  const router = useRouter();
  const params = useParams<{ region: string }>();

  const region = (params.region ?? "").toLowerCase();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const regionTeams = useMemo(() => {
    return teams
      .filter((team) => team.region.toLowerCase() === region)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [region]);

  const handleOpenDialog = (team: Team) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTeam(null);
  };

  const handleDraftNewRoster = () => {
    if (!selectedTeam) return;

    router.push(`/teams/${region}/${selectedTeam.slug}/draft`);
  };

  return (
    <>
      <PageContainer className="pt-[80px] pb-[80px]">
        <div className="flex flex-col gap-[32px]">
          <Button
            variant="text"
            onClick={() => router.push("/select-region")}
          >
            Back
          </Button>

          <div className="flex flex-col items-center gap-[4px]">
            <p className="body text-[var(--text-secondary)]">
              {region.toUpperCase()} Region
            </p>

            <h1 className="h1 text-[var(--text-primary)]">
              Choose Your Team
            </h1>
          </div>

          <div className="grid grid-cols-5 gap-[24px]">
            {regionTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onClick={() => handleOpenDialog(team)}
              />
            ))}
          </div>
        </div>
      </PageContainer>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        title={selectedTeam?.name ?? ""}
        description="Choose how you want to approach the team roster. You won’t be able to return to this selection later."
        secondaryLabel="KEEP THE CURRENT ROSTER"
        onSecondaryAction={() => {}}
        secondaryDisabled={true}
        primaryLabel="DRAFT NEW ROSTER"
        onPrimaryAction={handleDraftNewRoster}
      />
    </>
  );
}