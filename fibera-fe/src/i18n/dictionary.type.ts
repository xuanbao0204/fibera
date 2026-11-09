import type vi from "./dicts/vi.json";

export type Dictionary = typeof vi;

export type HeroMessages = Dictionary["landing-page"]["hero"];

export type LandingStats = Dictionary["landing-page"]["stats"]