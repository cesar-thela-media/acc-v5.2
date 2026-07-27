"use client";

// Adapted from the literal @shadcn-space/carousel-07 "stacked card" carousel
// (components/shadcn-space/carousel/carousel-07.tsx) — same drag physics and
// per-card motion values, restyled with real brand tokens instead of the
// vendor's bg-background/bg-muted/text-black defaults, and driven by real
// Membership Includes content instead of the vendor's travel-photo demo data.

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/shadcn/badge";

const SAGE_800 = "#2D3B2C";

export interface MembershipSlide {
  image: string;
  title: string;
  description: string;
  badge: string;
}

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}

const getCarouselConfig = (width: number): CarouselConfig => {
  // Tighter fan on phones so side cards don't feel clipped / cramped
  if (width < 640) {
    return {
      distanceDivisor: 100,
      velocityDivisor: 450,
      sensitivity: 160,
      xMultiplier: 72,
      yMultiplier: 10,
      rotationMultiplier: 4,
      scaleReduction: 0.05,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 160,
      yMultiplier: 36,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 210,
    yMultiplier: 48,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

export function MembershipCarousel({ slides }: { slides: MembershipSlide[] }) {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);

  const total = slides.length;

  React.useEffect(() => {
    // Reading the real width only after mount (rather than a lazy useState
    // initializer) keeps the first client render identical to the
    // server-rendered HTML, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = React.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  const handleDragStart = () => {
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, { type: "spring", stiffness: 200, damping: 30, mass: 1 });
  };

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const unsub = scrollProgress.on("change", (v) => {
      const rounded = Math.round(v);
      // Normalize into [0, total)
      const idx = ((rounded % total) + total) % total;
      setActiveIndex(idx);
    });
    return () => unsub();
  }, [scrollProgress, total]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full overflow-hidden select-none"
      style={{
        WebkitMaskImage:
          windowWidth > 0 && windowWidth < 640
            ? "none"
            : "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        maskImage:
          windowWidth > 0 && windowWidth < 640
            ? "none"
            : "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div className="relative w-full max-w-7xl h-[22rem] sm:h-128 lg:h-144 flex items-center justify-center">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing touch-pan-y"
          aria-label="Swipe membership benefits"
        />

        {slides.map((slide, i) => (
          <MembershipCard key={i} slide={slide} index={i} total={total} progress={scrollProgress} config={config} />
        ))}
      </div>

      {/* Mobile-friendly dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2 sm:mt-4 px-4" role="tablist" aria-label="Membership slides">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={slide.title}
            className="size-2 rounded-full transition-all"
            style={{
              background: i === activeIndex ? "#C2963A" : "rgba(255,255,255,0.35)",
              transform: i === activeIndex ? "scale(1.25)" : "scale(1)",
            }}
            onClick={() => {
              animate(scrollProgress, i, { type: "spring", stiffness: 200, damping: 30, mass: 1 });
            }}
          />
        ))}
      </div>
      <p className="sm:hidden text-center text-xs mt-3 px-6 max-w-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
        Swipe to explore benefits
      </p>
    </div>
  );
}

interface CardProps {
  slide: MembershipSlide;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
}

function MembershipCard({ slide, index, total, progress, config }: CardProps) {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (o) => o * config.xMultiplier);
  const rotate = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return o * config.rotationMultiplier;
  });
  const y = useTransform(offset, (o) => {
    const absO = Math.abs(o);
    if (absO < 0.05) return 0;
    return absO * config.yMultiplier;
  });
  const scale = useTransform(offset, (o) => 1 - Math.abs(o) * config.scaleReduction);
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0]
  );
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));
  const dimOpacity = useTransform(offset, [-2, -0.5, 0, 0.5, 2], [0.5, 0.2, 0, 0.2, 0.5]);
  const textOpacity = useTransform(offset, [-0.5, 0, 0.5], [0, 1, 0]);

  return (
    <motion.div
      style={{ x, rotate, y, scale, opacity, zIndex, background: "#fff" }}
      className={cn(
        "absolute rounded-2xl overflow-hidden group pointer-events-none",
        "w-[13.5rem] h-[17.5rem] sm:w-64 sm:h-88 lg:w-80 lg:h-104"
      )}
    >
      <Image
        key={slide.image}
        src={slide.image}
        alt={slide.title}
        fill
        sizes="(max-width: 640px) 216px, (max-width: 1024px) 256px, 320px"
        className="object-cover object-center pointer-events-none transition-transform duration-700 group-hover:scale-110"
      />

      <motion.div style={{ opacity: dimOpacity }} className="absolute inset-0 bg-black pointer-events-none" />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

      <Badge
        className="absolute top-3 right-3 sm:top-5 sm:right-5 lg:top-6 lg:right-6 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] sm:text-xs font-bold uppercase tracking-widest"
        style={{ color: SAGE_800 }}
      >
        {slide.badge}
      </Badge>

      <div className="absolute bottom-4 left-3 right-3 sm:bottom-8 sm:left-5 sm:right-5 lg:bottom-10 lg:left-6 lg:right-6 text-white text-left">
        <motion.p
          style={{ opacity: textOpacity }}
          className="text-sm sm:text-lg lg:text-xl font-semibold leading-tight mb-0.5 sm:mb-1 drop-shadow-md"
        >
          {slide.title}
        </motion.p>
        <motion.p
          style={{ opacity: textOpacity }}
          className="text-[11px] sm:text-xs text-white/75 line-clamp-2 font-medium"
        >
          {slide.description}
        </motion.p>
      </div>
    </motion.div>
  );
}
