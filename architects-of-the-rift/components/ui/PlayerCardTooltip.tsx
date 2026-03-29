"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { champions } from "@/app/data/champions";
import type { Player } from "@/app/types/player";
import type { Role } from "@/app/types/champion";

type Props = {
  player: Player;
  anchorRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
};

type TooltipSection = {
  title: string;
  entries: Array<{ label: string; value: string | number }>;
};

type TooltipPosition = {
  top: number;
  left: number;
};

const GAP = 16;
const VIEWPORT_MARGIN = 16;
const COLUMN_WIDTH = 146;
const MAX_COLUMNS = 5;
const TOOLTIP_WIDTH = COLUMN_WIDTH * MAX_COLUMNS + 8 * (MAX_COLUMNS - 1) + 32;

const CHAMPION_MASTERY_SCORES = [92, 90, 88, 86, 84, 82];

const ROLE_SPECIFIC_TITLES: Record<Role, string> = {
  top: "Top Specific",
  jungle: "Jungle Specific",
  mid: "Mid Specific",
  adc: "ADC Specific",
  support: "Support Specific",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const formatLabel = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const getChampionName = (championId: string) =>
  champions.find((champion) => champion.id === championId)?.name ??
  formatLabel(championId);

const deriveChampionMastery = (player: Player) => {
  const orderedChampionIds = Array.from(
    new Set([
      ...player.bestChampions,
      ...player.comfortChampions,
      ...player.championPool,
    ])
  ).slice(0, 6);

  return orderedChampionIds.map((championId, index) => ({
    label: getChampionName(championId),
    value: CHAMPION_MASTERY_SCORES[index] ?? Math.max(72, 92 - index * 2),
  }));
};

const getRoleSpecificEntries = (player: Player) => {
  const { primary, substats, playstyle } = player.advancedProfile;

  switch (player.role) {
    case "top":
      return [
        { label: "Lane Trading", value: substats.laneTrading },
        { label: "Carry Comfort", value: substats.carryComfort },
        { label: "Blind Stability", value: substats.blindStability },
        { label: "Scaling Orientation", value: playstyle.scalingOrientation },
      ];
    case "jungle":
      return [
        { label: "Roam Window Reading", value: substats.roamWindowReading },
        { label: "Objective Control", value: primary.objectiveControl },
        { label: "Rotation Timing", value: primary.rotationTiming },
        { label: "Utility Comfort", value: playstyle.utilityComfort },
      ];
    case "mid":
      return [
        { label: "Lane Trading", value: substats.laneTrading },
        { label: "Roam Frequency", value: primary.roamFrequency },
        { label: "Counter Pick Strength", value: primary.counterPickStrength },
        { label: "Style Flex", value: playstyle.styleFlex },
      ];
    case "adc":
      return [
        { label: "Mechanical Execution", value: substats.mechanicalExecution },
        { label: "Teamfight Spacing", value: substats.teamfightSpacing },
        { label: "Carry Resource Usage", value: playstyle.carryResourceUsage },
        { label: "Patch Comfort", value: primary.patchComfort },
      ];
    case "support":
      return [
        { label: "Vision Craft", value: substats.visionCraft },
        { label: "Roam Bias", value: playstyle.roamBias },
        { label: "Utility Comfort", value: playstyle.utilityComfort },
        { label: "Communication", value: player.advancedProfile.hiddenTraits.communication },
      ];
  }
};

function buildSections(player: Player): TooltipSection[] {
  const { seed, substats, primary, playstyle, tendencies, hiddenTraits } =
    player.advancedProfile;

  return [
    {
      title: "Seed",
      entries: [
        { label: "Execution", value: seed.execution },
        { label: "Map Sense", value: seed.mapSense },
        { label: "Combat", value: seed.combat },
        { label: "Resilience", value: seed.resilience },
        { label: "Stability", value: seed.stability },
        { label: "Game Read", value: seed.gameRead },
      ],
    },
    {
      title: "Primary Combat",
      entries: [
        { label: "Mechanics", value: primary.mechanics },
        { label: "Laning", value: primary.laning },
        { label: "Positioning", value: primary.positioning },
        { label: "Skirmishing", value: primary.skirmishing },
        { label: "Teamfighting", value: primary.teamfighting },
      ],
    },
    {
      title: "Primary Macro",
      entries: [
        { label: "Map Awareness", value: primary.mapAwareness },
        { label: "Objective Control", value: primary.objectiveControl },
        { label: "Rotation Timing", value: primary.rotationTiming },
        { label: "Consistency", value: primary.consistency },
        { label: "Adaptability", value: primary.adaptability },
        { label: "Discipline", value: primary.discipline },
        { label: "Clutch Factor", value: primary.clutchFactor },
      ],
    },
    {
      title: "Draft Profile",
      entries: [
        { label: "Champion Pool Size", value: primary.championPoolSize },
        { label: "Meta Readiness", value: primary.metaReadiness },
        { label: "Blind Pick Strength", value: primary.blindPickStrength },
        { label: "Counter Pick Strength", value: primary.counterPickStrength },
        { label: "Current Form", value: primary.currentForm },
        { label: "Patch Comfort", value: primary.patchComfort },
      ],
    },
    {
      title: "Micro",
      entries: [
        { label: "Mechanical Execution", value: substats.mechanicalExecution },
        { label: "Reaction Time", value: substats.reactionTime },
        { label: "Lane Trading", value: substats.laneTrading },
        { label: "Spacing", value: substats.spacing },
        { label: "Combo Precision", value: substats.comboPrecision },
      ],
    },
    {
      title: ROLE_SPECIFIC_TITLES[player.role],
      entries: getRoleSpecificEntries(player),
    },
    {
      title: "Combat",
      entries: [
        { label: "Skirmish Instinct", value: substats.skirmishInstinct },
        { label: "Teamfight Spacing", value: substats.teamfightSpacing },
        { label: "Target Selection", value: substats.targetSelection },
        { label: "Pressure Execution", value: substats.pressureExecution },
        { label: "Discipline Under Stress", value: substats.disciplineUnderStress },
      ],
    },
    {
      title: "Map Play",
      entries: [
        { label: "Map Reading", value: substats.mapReading },
        { label: "Vision Craft", value: substats.visionCraft },
        { label: "Roam Window Reading", value: substats.roamWindowReading },
      ],
    },
    {
      title: "Macro",
      entries: [
        { label: "Objective Setup", value: substats.objectiveSetup },
        { label: "Rotation Planning", value: substats.rotationPlanning },
        { label: "Risk Calibration", value: substats.riskCalibration },
      ],
    },
    {
      title: "Adaptability",
      entries: [
        { label: "Meta Adaptation", value: substats.metaAdaptation },
        { label: "Blind Stability", value: substats.blindStability },
        { label: "Counter Prep", value: substats.counterPrep },
        { label: "Champion Depth", value: substats.championDepth },
        { label: "Patch Integration", value: substats.patchIntegration },
        { label: "Carry Comfort", value: substats.carryComfort },
        { label: "Utility Comfort", value: substats.utilityComfort },
        { label: "Style Flex", value: substats.styleFlex },
      ],
    },
    {
      title: "Playstyle",
      entries: [
        { label: "Carry Resource Usage", value: playstyle.carryResourceUsage },
        { label: "Utility Comfort", value: playstyle.utilityComfort },
        { label: "Playmaking Intent", value: playstyle.playmakingIntent },
        { label: "Scaling Orientation", value: playstyle.scalingOrientation },
        { label: "Lane Control Bias", value: playstyle.laneControlBias },
        { label: "Roam Bias", value: playstyle.roamBias },
        { label: "Risk Appetite", value: playstyle.riskAppetite },
        { label: "Setup Dependence", value: playstyle.setupDependence },
        { label: "Style Flex", value: playstyle.styleFlex },
      ],
    },
    {
      title: "Tendencies",
      entries: [
        { label: "Invade Frequency", value: tendencies.invadeFrequency },
        { label: "Tower Dive Frequency", value: tendencies.towerDiveFrequency },
        { label: "Objective Contest Bias", value: tendencies.objectiveContestBias },
        { label: "Split Push Bias", value: tendencies.splitPushBias },
        { label: "Flank Preference", value: tendencies.flankPreference },
        { label: "Safe Lane Preference", value: tendencies.safeLanePreference },
        { label: "Lane Revisit Bias", value: tendencies.laneRevisitBias },
        { label: "Reset Discipline", value: tendencies.resetDiscipline },
      ],
    },
    {
      title: "Hidden Traits",
      entries: [
        { label: "Greed", value: hiddenTraits.greed },
        { label: "Composure", value: hiddenTraits.composure },
        { label: "Leadership", value: hiddenTraits.leadership },
        { label: "Communication", value: hiddenTraits.communication },
        { label: "Volatility", value: hiddenTraits.volatility },
      ],
    },
    {
      title: "Champion Mastery",
      entries: deriveChampionMastery(player),
    },
  ];
}

export default function PlayerCardTooltip({ player, anchorRef, visible }: Props) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });

  const sections = useMemo(() => buildSections(player), [player]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) {
      return;
    }

    const updatePosition = () => {
      const anchorRect = anchorRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();

      if (!anchorRect || !tooltipRect) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const rightLeft = anchorRect.right + GAP;
      const leftLeft = anchorRect.left - tooltipRect.width - GAP;

      let left = rightLeft;
      let top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;

      if (rightLeft + tooltipRect.width + VIEWPORT_MARGIN <= viewportWidth) {
        left = rightLeft;
      } else if (leftLeft >= VIEWPORT_MARGIN) {
        left = leftLeft;
      } else {
        left = clamp(
          anchorRect.left + (anchorRect.width - tooltipRect.width) / 2,
          VIEWPORT_MARGIN,
          viewportWidth - tooltipRect.width - VIEWPORT_MARGIN
        );

        const bottomTop = anchorRect.bottom + GAP;
        const topTop = anchorRect.top - tooltipRect.height - GAP;

        if (bottomTop + tooltipRect.height + VIEWPORT_MARGIN <= viewportHeight) {
          top = bottomTop;
        } else if (topTop >= VIEWPORT_MARGIN) {
          top = topTop;
        }
      }

      top = clamp(
        top,
        VIEWPORT_MARGIN,
        viewportHeight - tooltipRect.height - VIEWPORT_MARGIN
      );

      left = clamp(
        left,
        VIEWPORT_MARGIN,
        viewportWidth - tooltipRect.width - VIEWPORT_MARGIN
      );

      setPosition({ top, left });
    };

    updatePosition();

    const handleViewportChange = () => updatePosition();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [anchorRef, sections, visible]);

  if (!mounted || !visible) {
    return null;
  }

  return createPortal(
    <div
      ref={tooltipRef}
      className="player-card-tooltip tooltip no-scrollbar"
      style={{
        top: position.top,
        left: position.left,
        width: TOOLTIP_WIDTH,
      }}
      aria-hidden={!visible}
    >
      <div className="player-card-tooltip__grid">
        {sections.map((section) => (
          <div key={section.title} className="player-card-tooltip__section">
            <div className="player-card-tooltip__title label">{section.title}</div>

            <div className="player-card-tooltip__entries">
              {section.entries.map((entry) => (
                <div key={`${section.title}-${entry.label}`} className="player-card-tooltip__entry">
                  <span className="player-card-tooltip__entry-label">
                    {formatLabel(entry.label)}:
                  </span>{" "}
                  <span className="player-card-tooltip__entry-value">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
