"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import PlayerCard from "@/components/ui/PlayerCard";
import PlayerSelectionBar from "@/components/ui/PlayerSelectionBar";
import Dialog from "@/components/ui/Dialog";
import { teams } from "@/app/data/teams";
import { players } from "@/app/data/players";
import type { Player } from "@/app/types/player";
import type { Role } from "@/app/types/champion";
import useBackRedirect from "@/app/hooks/useBrowserBackRedirect.ts";

type SelectedPlayers = Partial<Record<Role, Player>>;

type DraftSave = {
  region: string;
  controlledTeamSlug: string;
  budget: number;
  leftRp: number;
  roster: Record<Role, string>;
  updatedTeamRosters: Record<string, Record<Role, string>>;
  playerTeamAssignments: Record<string, string>;
  freeAgentPlayerIds: string[];
};

const roleOrder: Role[] = ["top", "jungle", "mid", "adc", "support"];
const MAX_BUDGET = 39;

export default function DraftPage() {
  const router = useRouter();
  const params = useParams<{ region: string; teamSlug: string }>();

  useBackRedirect("/");

  const region = (params.region ?? "").toLowerCase();
  const teamSlug = params.teamSlug ?? "";

  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayers>({});
  const [isReadyDialogOpen, setIsReadyDialogOpen] = useState(false);

  const selectedTeam = useMemo(() => {
    return teams.find((team) => team.slug === teamSlug) ?? null;
  }, [teamSlug]);

  const regionTeams = useMemo(() => {
    return teams.filter((team) => team.region.toLowerCase() === region);
  }, [region]);

  const regionTeamIds = useMemo(() => {
    return regionTeams.map((team) => team.id);
  }, [regionTeams]);

  const groupedTeamPlayers = useMemo(() => {
    return regionTeams.map((team) => ({
      team,
      players: players
        .filter((player) => player.teamId === team.id)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [regionTeams]);

  const freeAgentPlayers = useMemo(() => {
    return players
      .filter((player) => player.teamId === "free-agent")
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, []);

  const selectedRoleSet = useMemo(() => {
    return new Set(
      roleOrder.filter((role) => selectedPlayers[role]).map((role) => role)
    );
  }, [selectedPlayers]);

  const usedBudget = useMemo(() => {
    return Object.values(selectedPlayers).reduce((total, player) => {
      return total + (player?.rosterPoints ?? 0);
    }, 0);
  }, [selectedPlayers]);

  const remainingRpRaw = useMemo(() => {
    return MAX_BUDGET - usedBudget;
  }, [usedBudget]);

  const leftRp = useMemo(() => {
    return MAX_BUDGET - usedBudget;
  }, [usedBudget]);

  const allRolesFilled = useMemo(() => {
    return roleOrder.every((role) => selectedPlayers[role]);
  }, [selectedPlayers]);

  const isReadyDisabled = !allRolesFilled || remainingRpRaw < 0;

  const handleSelectPlayer = (player: Player) => {
    if (selectedPlayers[player.role]) return;

    setSelectedPlayers((current) => ({
      ...current,
      [player.role]: player,
    }));
  };

  const handleRemovePlayer = (role: Role) => {
    setSelectedPlayers((current) => {
      const next = { ...current };
      delete next[role];
      return next;
    });
  };

  const handleOpenReadyDialog = () => {
    if (isReadyDisabled) return;
    setIsReadyDialogOpen(true);
  };

  const handleCloseReadyDialog = () => {
    setIsReadyDialogOpen(false);
  };

  const handleConfirmReady = () => {
    if (!selectedTeam) return;

    const regionPlayersList = players.filter((player) =>
      regionTeamIds.includes(player.teamId)
    );

    const originalTeamRosters: Record<string, Partial<Record<Role, Player>>> =
      {};

    for (const team of regionTeams) {
      originalTeamRosters[team.id] = {};
    }

    for (const player of regionPlayersList) {
      originalTeamRosters[player.teamId] = {
        ...originalTeamRosters[player.teamId],
        [player.role]: player,
      };
    }

    const updatedTeamRosters: Record<string, Record<Role, string>> = {};

    for (const team of regionTeams) {
      const originalRoster = originalTeamRosters[team.id];

      updatedTeamRosters[team.id] = {
        top: originalRoster.top?.id ?? "",
        jungle: originalRoster.jungle?.id ?? "",
        mid: originalRoster.mid?.id ?? "",
        adc: originalRoster.adc?.id ?? "",
        support: originalRoster.support?.id ?? "",
      };
    }

    const freeAgentIds = new Set(
      players
        .filter((player) => player.teamId === "free-agent")
        .map((player) => player.id)
    );

    for (const role of roleOrder) {
      const chosenPlayer = selectedPlayers[role];
      if (!chosenPlayer) continue;

      const outgoingPlayer = originalTeamRosters[selectedTeam.id]?.[role];
      if (!outgoingPlayer) continue;

      updatedTeamRosters[selectedTeam.id][role] = chosenPlayer.id;

      if (chosenPlayer.teamId === "free-agent") {
        freeAgentIds.delete(chosenPlayer.id);
        freeAgentIds.add(outgoingPlayer.id);
        continue;
      }

      if (chosenPlayer.teamId !== selectedTeam.id) {
        updatedTeamRosters[chosenPlayer.teamId][role] = outgoingPlayer.id;
      }
    }

    const playerTeamAssignments: Record<string, string> = {};

    for (const team of regionTeams) {
      const roster = updatedTeamRosters[team.id];

      for (const role of roleOrder) {
        const playerId = roster[role];
        if (!playerId) continue;
        playerTeamAssignments[playerId] = team.id;
      }
    }

    for (const freeAgentId of freeAgentIds) {
      playerTeamAssignments[freeAgentId] = "free-agent";
    }

    const savePayload: DraftSave = {
      region,
      controlledTeamSlug: selectedTeam.slug,
      budget: usedBudget,
      leftRp,
      roster: {
        top: selectedPlayers.top?.id ?? "",
        jungle: selectedPlayers.jungle?.id ?? "",
        mid: selectedPlayers.mid?.id ?? "",
        adc: selectedPlayers.adc?.id ?? "",
        support: selectedPlayers.support?.id ?? "",
      },
      updatedTeamRosters,
      playerTeamAssignments,
      freeAgentPlayerIds: Array.from(freeAgentIds),
    };

    localStorage.setItem("rift-draft-save", JSON.stringify(savePayload));
    router.push("/gameplay-dashboard");
  };

  const readyDescription = roleOrder
    .map((role) => {
      const player = selectedPlayers[role];
      return `${role.toUpperCase()}: ${player?.name ?? "-"}`;
    })
    .join("\n");

  return (
    <>
      <PageContainer className="pt-[80px] pb-[140px]">
        <div className="flex flex-col items-center gap-[32px]">
          <div className="flex flex-col items-center gap-[4px]">
            <p className="h3 text-center text-[var(--text-primary)]">
              {region.toUpperCase()} Region -{" "}
              {selectedTeam?.name ?? "<Chosen Team Name>"}
            </p>

            <h1 className="h1 w-[600px] text-center text-[var(--text-primary)]">
              Choose Your Team
            </h1>
          </div>

          <p className="h3 w-[720px] text-center text-[var(--text-highlight)]">
            You have a {MAX_BUDGET} Roster Points budget.
          </p>

          <p className="body w-[720px] text-center text-[var(--text-secondary)]">
            Pick one player for each role.
            <br />
            Selecting a player from another team will swap them with the player
            currently occupying that role.
            <br />
            Selecting a Free Agent will add them to your team, and your current
            player in that role will become a Free Agent.
          </p>

          <div className="flex w-full flex-col gap-[40px]">
            {groupedTeamPlayers.map((group) => (
              <section key={group.team.id} className="flex flex-col gap-[16px]">
                <h2 className="h3 text-[var(--text-primary)]">
                  {group.team.name}
                </h2>

                <div className="grid grid-cols-4 gap-[24px] self-stretch justify-items-center">
                  {group.players.map((player) => {
                    const isSelected =
                      selectedPlayers[player.role]?.id === player.id;
                    const isDisabled =
                      !isSelected && selectedRoleSet.has(player.role);

                    return (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        selected={isSelected}
                        disabled={isDisabled}
                        onClick={() => handleSelectPlayer(player)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}

            <section className="flex flex-col gap-[16px]">
              <h2 className="h3 text-[var(--text-primary)]">Free Agents</h2>

              <div className="grid grid-cols-4 gap-[24px] self-stretch justify-items-center">
                {freeAgentPlayers.map((player) => {
                  const isSelected =
                    selectedPlayers[player.role]?.id === player.id;
                  const isDisabled =
                    !isSelected && selectedRoleSet.has(player.role);

                  return (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      selected={isSelected}
                      disabled={isDisabled}
                      onClick={() => handleSelectPlayer(player)}
                    />
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </PageContainer>

      <PlayerSelectionBar
        selectedPlayers={selectedPlayers}
        leftRp={leftRp}
        isOverBudget={leftRp < 0}
        onRemovePlayer={handleRemovePlayer}
        onReady={handleOpenReadyDialog}
      />

      <Dialog
        open={isReadyDialogOpen}
        onClose={handleCloseReadyDialog}
        title="Ready to start?"
        description={readyDescription}
        secondaryLabel="Back"
        onSecondaryAction={handleCloseReadyDialog}
        primaryLabel="Ready"
        onPrimaryAction={handleConfirmReady}
      />
    </>
  );
}