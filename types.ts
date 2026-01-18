export enum Category {
  MACRAME = 'Macrame',
  BLEACH_ART = 'Bleach Art',
  DTF = 'DTF Sublimation',
  PAINTING = 'Painting',
  MISCELLANEOUS = 'Miscellaneous'
}

export const InitialCategories = [
  Category.MACRAME,
  Category.BLEACH_ART,
  Category.DTF,
  Category.PAINTING,
  Category.MISCELLANEOUS
];

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  price?: string;
}

export interface DesignIdea {
  title: string;
  description: string;
  materials: string[];
  difficulty: "Beginner" | "Intermediate" | "Expert";
  visualPrompt: string;
}

export interface GeneratedConcept {
  idea: DesignIdea;
  imageUrl: string;
}

export interface ArtistProfile {
  headline: string;
  highlight: string;
  description: string;
  imageUrl: string;
}
