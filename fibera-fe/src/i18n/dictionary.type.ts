import type vi from "./dicts/vi.json";

export type Dictionary = typeof vi;

export type NavbarMessages = Dictionary["navbar"];

export type FooterMessages = Dictionary["footer"];

export type HeroMessages = Dictionary["landing-page"]["hero"];

export type LandingStats = Dictionary["landing-page"]["stats"];

export type FeaturesMessages = Dictionary["landing-page"]["features"];

export type HowItWorksMessages = Dictionary["landing-page"]["howItWorks"];

export type AudienceMessages = Dictionary["landing-page"]["audience"];

export type FaqMessages = Dictionary["landing-page"]["faq"];

export type CtaMessages = Dictionary["landing-page"]["cta"];

export type ContactMessages = Dictionary["landing-page"]["contact"];

export type LoginMessages = Dictionary["login"];

export type RegisterMessages = Dictionary["register"];