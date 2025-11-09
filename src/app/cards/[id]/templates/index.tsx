import type { Card } from "@/services/business-cards";
import DefaultCard from "./DefaultCard";
import MedyourCard from "./medyour/MedyourCard";
import AxiomCard from "./axiom/AxiomCard";

export type SocialLink = { label: string; href: string };
export type BrandTemplateProps = {
  card: Card;
  socials: SocialLink[];
  ensureHttp: (url?: string) => string;
};
export type BrandTemplate = (props: BrandTemplateProps) => React.JSX.Element;

const templates: Record<string, BrandTemplate> = {
  medyour: MedyourCard,
  axiom: AxiomCard,
};

export function getTemplateByCustomerId(customerId?: string): BrandTemplate {
  const key = (customerId || "").trim().toLowerCase();
  return templates[key] ?? DefaultCard;
}
