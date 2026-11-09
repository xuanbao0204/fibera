"use client";
import { useEffect, useRef, useState } from "react";

export function CountUp({ value }: { value: string }) {
  const match = /^([\d,]+)(.*)$/.exec(value);
  const target = match && !value.includes("/") ? Number(match[1].replace(/,/g, "")) : null;
  const suffix = match?.[2] ?? "";
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1400, 1);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  if (target === null) return <span>{value}</span>;
  return <span ref={ref}>{n.toLocaleString("en-US")}{suffix}</span>;
}
