export interface RateTable {
  id: string;
  name: string;
  description: string;
  type: string;
  clients: string[];
  laborCategories: string[];
  rows: RateTableRow[];
}

export interface RateTableRow {
  laborCategoryId?: string;
  personId?: string;
  rate: number;
}
