export interface CategorySelection {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  number: number | null;
  isCustom: boolean;
  originalSelection?: boolean;
  confirm?: CategoryCancelConfirm;
}

export interface CategoryCancelConfirm {
  label: string;
  data?: Record<string, string>;
}
