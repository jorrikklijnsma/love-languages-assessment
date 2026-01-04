export interface QuestionOption {
  text: string;
  language: string;
  weight: number;
}

export interface Question {
  id: number;
  text: string;
  category?: "scenario" | "intensity";
  context: "giving" | "receiving";
  options: QuestionOption[];
}

export type LanguageKey = 'words' | 'quality_time' | 'service' | 'touch' | 'gifts';

export interface LanguageScores {
  words: number;
  quality_time: number;
  service: number;
  touch: number;
  gifts: number;
}

export interface Scores {
  receiving: LanguageScores;
  giving: LanguageScores;
}

export interface LanguageDetail {
  name: string;
  short_description: string;
  receiving: {
    high: {
      description: string;
      strengths: string[];
      challenges: string[];
      triggers: string[];
    };
    medium: {
      description: string;
      strengths: string[];
      challenges: string[];
      triggers: string[];
    };
    low: {
      description: string;
      strengths: string[];
      challenges: string[];
      triggers: string[];
    };
  };
  giving: {
    high: {
      description: string;
      strengths: string[];
      challenges: string[];
      growth_areas: string[];
    };
    medium: {
      description: string;
      strengths: string[];
      challenges: string[];
      growth_areas: string[];
    };
    low: {
      description: string;
      strengths: string[];
      challenges: string[];
      growth_areas: string[];
    };
  };
}

export interface Activity {
  title: string;
  description: string;
  difficulty: string;
  time: string;
}

export interface ConclusionsData {
  language_details: {
    [key: string]: LanguageDetail;
  };
  activities_solo: {
    [key: string]: Activity[];
  };
  activities_couples: {
    strengths: Array<{
      match: string;
      title: string;
      description: string;
      difficulty: string;
      time: string;
    }>;
    challenges: Array<{
      mismatch: string;
      title: string;
      description: string;
      difficulty: string;
      time: string;
    }>;
    general: Array<{
      title: string;
      description: string;
      difficulty: string;
      time: string;
    }>;
  };
  partner_compatibility: {
    giving_receiving_dynamics: {
      [key: string]: {
        description: string;
        advice: string;
        risk: string;
      };
    };
    specific_mismatches: {
      [key: string]: {
        challenge: string;
        bridge: string;
        watch_for: string;
      };
    };
  };
}