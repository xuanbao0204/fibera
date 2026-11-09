"use client";

import "./star-background.css";

const stars = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${(i * 37.5) % 100}%`,
    top: `${(i * 61.7) % 100}%`,
    size: `${1 + (i % 3)}px`,
    duration: `${2 + (i % 4)}s`,
    delay: `${(i % 5) * 0.7}s`,
}));

export function StarBackground() {
    return (
        <div className="star-background pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {stars.map((star) => (
                <span
                    key={star.id}
                    className="star"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: star.size,
                        height: star.size,
                        animationDuration: star.duration,
                        animationDelay: star.delay,
                    }}
                />
            ))}

            <span className="shooting-star shooting-star-1" />
            <span className="shooting-star shooting-star-2" />

            <span className="ambient-glow ambient-glow-1" />
            <span className="ambient-glow ambient-glow-2" />
        </div>
    );
}