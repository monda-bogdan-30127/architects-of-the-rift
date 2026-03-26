type ButtonVariant = "main" | "menu" | "secondary" | "text";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "main",
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "rounded-[12px] px-[16px] py-[12px] transition-all duration-150 uppercase disabled:cursor-not-allowed disabled:opacity-40";

  const typographyClasses = "label";

  const variantClasses: Record<ButtonVariant, string> = {
    main: `
      inline-flex items-center justify-center gap-[12px]
      bg-[var(--primary)]
      text-black
      hover:brightness-110
      active:brightness-90
      disabled:hover:brightness-100
      disabled:active:brightness-100
    `,

    menu: `
      flex w-[200px] items-center gap-[12px]
      bg-[var(--primary)]
      text-black text-left
      hover:brightness-110
      active:brightness-90
      disabled:hover:brightness-100
      disabled:active:brightness-100
    `,

    secondary: `
      inline-flex items-center justify-center gap-[12px]
      bg-[var(--bg-elevated)]
      text-[var(--text-primary)]
      hover:bg-[#232636]
      active:bg-[#2B2F42]
      disabled:hover:bg-[var(--bg-elevated)]
      disabled:active:bg-[var(--bg-elevated)]
    `,

    text: `
      inline-flex items-center gap-[12px]
      bg-transparent
      text-[var(--primary)]
      hover:text-[var(--text-highlight)]
      active:opacity-80
      disabled:hover:text-[var(--primary)]
      disabled:active:opacity-100
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${typographyClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}