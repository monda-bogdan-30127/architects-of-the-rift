"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  primaryDisabled?: boolean;
  secondaryDisabled?: boolean;
};

export default function Dialog({
  open,
  onClose,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  primaryDisabled = false,
  secondaryDisabled = false,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[rgba(11,11,15,0.40)]
        backdrop-blur-[4px]
      "
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="
          relative
          flex w-[440px] flex-col
          gap-[32px]
          rounded-[16px]
          bg-[var(--bg-surface)]
          px-[40px] py-[40px]
        "
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="
            absolute right-[24px] top-[24px]
            flex h-[24px] w-[24px] items-center justify-center
            text-[var(--primary)]
            transition-opacity hover:opacity-80
          "
        >
          <img
            src="/svg/x-icon.svg"
            alt=""
            className="h-[24px] w-[24px]"
          />
        </button>

        <div className="flex flex-col items-center gap-[16px] self-stretch text-center">
          <h2
            id="dialog-title"
            className="h1 text-[var(--text-primary)]"
          >
            {title}
          </h2>

          <p
            id="dialog-description"
            className="body-large whitespace-pre-line text-[var(--text-primary)]"
          >
            {description}
          </p>
        </div>

        <div className="flex items-start justify-center gap-[32px] self-stretch">
          <Button
            variant="secondary"
            onClick={onSecondaryAction}
            disabled={secondaryDisabled}
          >
            {secondaryLabel}
          </Button>

          <Button
            variant="main"
            onClick={onPrimaryAction}
            disabled={primaryDisabled}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}