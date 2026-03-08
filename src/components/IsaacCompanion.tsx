import Image from "next/image";

interface IsaacCompanionProps {
  message?: string;
  size?: "small" | "large";
}

export default function IsaacCompanion({ message, size = "small" }: IsaacCompanionProps) {
  if (size === "large") {
    return (
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[var(--accent-light)] shadow-lg">
          <Image
            src="/isaac.png"
            alt="Isaac"
            width={144}
            height={144}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {message && (
          <div className="rounded-2xl bg-[var(--surface-warm)] px-5 py-3 max-w-[280px] relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--surface-warm)] rotate-45" />
            <p className="text-sm text-[var(--foreground)] text-center relative z-10 leading-relaxed">
              {message}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border-2 border-[var(--accent-light)] shadow-sm">
        <Image
          src="/isaac.png"
          alt="Isaac"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      {message && (
        <div className="rounded-xl bg-[var(--surface-warm)] px-3 py-2 max-w-[260px]">
          <p className="text-xs text-[var(--foreground)] leading-relaxed">{message}</p>
        </div>
      )}
    </div>
  );
}
