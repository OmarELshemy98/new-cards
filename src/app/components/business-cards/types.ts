// app/components/business-cards/types.ts
export type TemplateType = "medyour" | "axiom" | "arcon" | "custom template";

export type FormValues = {
  name: string;
  title: string;
  email: string;
  website: string;
  template: TemplateType | "";
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  shortDescription: string;
  customerId: string;
};
