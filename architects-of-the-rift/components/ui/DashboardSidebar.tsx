"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEntranceAnimation } from "@/app/hooks/useEntranceAnimation";

type NavItem = {
  label: React.ReactNode;
  href: string;
  icon: string;
};

const clickableClass = "cursor-pointer";

const navItems: NavItem[] = [
  {
    label: "HOME",
    href: "/gameplay-dashboard",
    icon: "/svg/home.svg",
  },
  {
    label: "ROSTERS",
    href: "/gameplay-dashboard/rosters",
    icon: "/svg/roster.svg",
  },
  {
    label: (
      <>
        AWARD
        <br />
        RACE
      </>
    ),
    href: "/gameplay-dashboard/awards",
    icon: "/svg/award.svg",
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/gameplay-dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useEntranceAnimation("sidebar");

  return (
    <>
      <style>{`
        @keyframes sidebar-fade-in {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sidebar-active-glow {
          0%, 100% { box-shadow: inset 0 0 12px color-mix(in srgb, var(--text-highlight) 18%, transparent); }
          50%      { box-shadow: inset 0 0 18px color-mix(in srgb, var(--text-highlight) 28%, transparent); }
        }
        .sidebar-nav-button {
          transition: background-color 0.18s ease, transform 0.18s ease, border-color 0.2s ease;
        }
        .sidebar-nav-button:hover {
          transform: translateY(-1px);
        }
        .sidebar-nav-button-active {
          animation: sidebar-active-glow 2.6s ease-in-out infinite;
        }
        .sidebar-logo-button {
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .sidebar-logo-button:hover {
          transform: scale(1.04);
          filter: drop-shadow(0 0 8px color-mix(in srgb, var(--primary) 40%, transparent));
        }
        @media (prefers-reduced-motion: reduce) {
          .sidebar-anim,
          .sidebar-nav-button-active {
            animation: none !important;
          }
          .sidebar-nav-button,
          .sidebar-logo-button {
            transition: none !important;
          }
        }
      `}</style>

      <aside
        className="
          sticky top-[16px] self-start
          h-[calc(100vh-32px)] w-[88px] shrink-0
          rounded-[24px]
          border
          bg-[var(--bg-elevated)]
          shadow-[0_8px_8px_rgba(0,0,0,0.25)]
        "
        style={{ borderColor: "var(--border-strong)" }}
      >
        <div className="flex h-full flex-col items-start gap-[64px] p-[12px]">
          <button
            type="button"
            onClick={() => router.push("/")}
            className={`sidebar-logo-button flex h-[64px] w-[64px] items-center justify-center ${clickableClass} ${
              mounted ? "sidebar-anim" : ""
            }`}
            style={{
              cursor: "pointer",
              animation: mounted
                ? "sidebar-fade-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.05s both"
                : undefined,
            }}
            aria-label="Go to start page"
          >
            <img
              src="/svg/lol-esport-logo.svg"
              alt="Dashboard logo"
              className="h-[64px] w-[64px] object-contain"
            />
          </button>

          <nav className="flex w-full flex-col items-start gap-[8px]">
            {navItems.map((item, index) => {
              const active = isActivePath(pathname, item.href);
              const animDelay = `${0.15 + index * 0.07}s`;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => router.push(item.href)}
                  className={`
                    sidebar-nav-button
                    ${active ? "sidebar-nav-button-active" : ""}
                    ${mounted ? "sidebar-anim" : ""}
                    flex h-[64px] w-[64px] flex-col items-center justify-center gap-[4px]
                    rounded-[8px] border ${clickableClass}
                  `}
                  style={{
                    backgroundColor: active
                      ? "color-mix(in srgb, var(--text-highlight) 6%, var(--bg-elevated))"
                      : "transparent",
                    borderColor: active
                      ? "color-mix(in srgb, var(--text-highlight) 55%, transparent)"
                      : "transparent",
                    cursor: "pointer",
                    animation: mounted
                      ? `sidebar-fade-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${animDelay} both`
                      : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-[24px] w-[24px] shrink-0 object-contain"
                    style={{
                      filter: active
                        ? "drop-shadow(0 0 6px color-mix(in srgb, var(--text-highlight) 50%, transparent))"
                        : "none",
                      transition: "filter 0.25s ease",
                    }}
                  />

                  <span
                    className="button text-center leading-[14px]"
                    style={{
                      color: active
                        ? "var(--text-highlight)"
                        : "var(--primary)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}