const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-primary/[0.04] blur-[100px] animate-float-slow" />
      <div className="absolute top-[60%] right-[8%] w-96 h-96 rounded-full bg-accent/[0.03] blur-[120px] animate-float-slower" />
      <div className="absolute bottom-[20%] left-[40%] w-64 h-64 rounded-full bg-primary/[0.03] blur-[80px] animate-float-slow [animation-delay:3s]" />

      {/* Light beam sweep */}
      <div className="absolute top-0 left-[20%] w-px h-[200px] bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-beam-sweep [animation-delay:2s]" />
      <div className="absolute top-0 left-[65%] w-px h-[300px] bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-beam-sweep [animation-delay:5s]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
    </div>
  );
};

export default BackgroundAnimation;
