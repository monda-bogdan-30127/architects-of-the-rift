"use client";

import { usePathname, useRouter } from "next/navigation";

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

  return (
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
          className={`flex h-[64px] w-[64px] items-center justify-center ${clickableClass}`}
          style={{ cursor: "pointer" }}
          aria-label="Go to start page"
        >
          <img
            src="/svg/lol-esport-logo.svg"
            alt="Dashboard logo"
            className="h-[64px] w-[64px] object-contain"
          />
        </button>

        <nav className="flex w-full flex-col items-start gap-[8px]">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`
                  flex h-[64px] w-[64px] flex-col items-center justify-center gap-[4px]
                  rounded-[8px] border transition-colors duration-150 ${clickableClass}
                `}
                style={{
                  backgroundColor: active ? "var(--bg-elevated)" : "transparent",
                  borderColor: active ? "var(--text-highlight)" : "transparent",
                  cursor: "pointer",
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
                />

                <span
                  className="button text-center leading-[14px]"
                  style={{ color: "var(--primary)" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
