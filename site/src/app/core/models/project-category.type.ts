export type ProjectCategory =
  | {
      id: string;
      isCustom: true;
      label: string;
      description?: string;
      icon?: string;
      sameAs?: string;
    }
  | {
      id: string;
      isCustom: false;
    };
