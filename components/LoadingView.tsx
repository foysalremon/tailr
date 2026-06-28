interface LoadingViewProps {
  message: string;
}

export default function LoadingView({ message }: LoadingViewProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-7 text-center">
        {/* Pulsing ring — one considered visual, not three generic dots */}
        <div className="relative w-10 h-10">
          <span className="absolute inset-0 rounded-full border-2 border-accent motion-safe:animate-ping opacity-25" />
          <span className="absolute inset-2.5 rounded-full bg-accent" />
        </div>

        <div className="flex flex-col gap-2">
          <p
            key={message}
            className="text-[0.975rem] font-medium text-ink motion-safe:animate-message-in"
            aria-live="polite"
            aria-atomic="true"
          >
            {message}
          </p>
          <p className="text-sm text-muted">This usually takes 15–25 seconds.</p>
        </div>
      </div>
    </div>
  );
}
