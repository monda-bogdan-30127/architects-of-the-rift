"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Player } from "@/app/types/player";
import { teams } from "@/app/data/teams";
import { champions } from "@/app/data/champions";
import PlayerCardTooltip from "@/components/ui/PlayerCardTooltip";

type Props = {
  player: Player;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
};

const HOVER_DELAY_MS = 250;

export default function PlayerCard({
  player,
  onClick,
  disabled = false,
  selected = false,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const team =
    player.teamId === "free-agent"
      ? null
      : teams.find((item) => item.id === player.teamId);

  const teamName =
    player.teamId === "free-agent" ? "Free Agent" : team?.name ?? "Unknown Team";

  const bestChampions = player.bestChampions
    .map((championId) =>
      champions.find((champion) => champion.id === championId)
    )
    .filter(
      (champion): champion is NonNullable<(typeof champions)[number]> =>
        Boolean(champion)
    )
    .slice(0, 4);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearHoverTimer();
    hoverTimerRef.current = window.setTimeout(() => {
      setIsTooltipVisible(true);
    }, HOVER_DELAY_MS);
  };

  const handleMouseLeave = () => {
    clearHoverTimer();
    setIsTooltipVisible(false);
  };

  useEffect(() => {
    return () => {
      clearHoverTimer();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="player-card-anchor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        display: "block",
        width: 252,
        minWidth: 252,
        flex: "0 0 252px",
      }}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`player-card ${
          selected ? "player-card--selected" : ""
        } ${disabled ? "player-card--disabled" : ""}`}
        style={{
          width: 252,
          minWidth: 252,
          maxWidth: 252,
          minHeight: 380,
          display: "flex",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <div
          className="player-card__rp"
          style={{
            width: 58,
            minWidth: 58,
            padding: "24px 8px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            className="player-card__rp-value h2"
            style={{
              lineHeight: 1,
              fontSize: 22,
            }}
          >
            {player.rosterPoints}
          </div>
          <div
            className="player-card__rp-label button"
            style={{
              fontSize: 11,
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            Roster Points
          </div>
        </div>

        <div
          className="player-card__content"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "14px 14px 14px",
            textAlign: "left",
          }}
        >
          <div
            className="player-card__image-wrap"
            style={{
              position: "relative",
              width: 132,
              height: 132,
              margin: "0 auto 10px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={player.image}
              alt={player.name}
              width={132}
              height={132}
              className="player-card__image"
              style={{
                width: 132,
                height: 132,
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          </div>

          <div
            className="player-card__identity"
            style={{
              marginBottom: 10,
              textAlign: "left",
            }}
          >
            <div
              className="player-card__name h2"
              style={{
                marginBottom: 4,
                fontSize: 22,
                lineHeight: 1.05,
                textAlign: "left",
              }}
            >
              {player.name}
            </div>
            <div
              className="player-card__meta button"
              style={{
                fontSize: 12,
                lineHeight: 1.2,
                textAlign: "left",
              }}
            >
              {teamName} - {player.role.toUpperCase()}
            </div>
          </div>

          <div
            className="player-card__stats"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "6px 14px",
              marginBottom: 12,
            }}
          >
            <div
              className="player-card__stat"
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                className="player-card__stat-label button"
                style={{ fontSize: 12 }}
              >
                MEC
              </span>
              <span
                className="player-card__stat-value body"
                style={{ fontSize: 13 }}
              >
                {player.stats.mec}
              </span>
            </div>

            <div
              className="player-card__stat"
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                className="player-card__stat-label button"
                style={{ fontSize: 12 }}
              >
                MAC
              </span>
              <span
                className="player-card__stat-value body"
                style={{ fontSize: 13 }}
              >
                {player.stats.mac}
              </span>
            </div>

            <div
              className="player-card__stat"
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                className="player-card__stat-label button"
                style={{ fontSize: 12 }}
              >
                TFG
              </span>
              <span
                className="player-card__stat-value body"
                style={{ fontSize: 13 }}
              >
                {player.stats.tfg}
              </span>
            </div>

            <div
              className="player-card__stat"
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                className="player-card__stat-label button"
                style={{ fontSize: 12 }}
              >
                CLT
              </span>
              <span
                className="player-card__stat-value body"
                style={{ fontSize: 13 }}
              >
                {player.stats.clt}
              </span>
            </div>

            <div
              className="player-card__stat"
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                className="player-card__stat-label button"
                style={{ fontSize: 12 }}
              >
                CON
              </span>
              <span
                className="player-card__stat-value body"
                style={{ fontSize: 13 }}
              >
                {player.stats.con}
              </span>
            </div>

            <div
              className="player-card__stat"
              style={{ display: "flex", alignItems: "baseline", gap: 6 }}
            >
              <span
                className="player-card__stat-label button"
                style={{ fontSize: 12 }}
              >
                IQ
              </span>
              <span
                className="player-card__stat-value body"
                style={{ fontSize: 13 }}
              >
                {player.stats.iq}
              </span>
            </div>
          </div>

          <div
            className="player-card__best-champs"
            style={{
              marginTop: "auto",
              textAlign: "left",
            }}
          >
            <div
              className="player-card__best-champs-label button"
              style={{
                marginBottom: 8,
                fontSize: 12,
                textAlign: "left",
              }}
            >
              Best Champs
            </div>

            <div
              className="player-card__best-champs-list"
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-start",
              }}
            >
              {bestChampions.map((champion) => (
                <div
                  key={champion.id}
                  className="player-card__best-champ"
                  style={{
                    width: 30,
                    height: 30,
                    minWidth: 30,
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={champion.image}
                    alt={champion.name}
                    width={30}
                    height={30}
                    className="player-card__best-champ-image"
                    style={{
                      width: 30,
                      height: 30,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </button>

      <PlayerCardTooltip
        player={player}
        anchorRef={cardRef}
        visible={isTooltipVisible}
      />
    </div>
  );
}