export interface ClaimFilter {
  claim: string[];
  op?: 'and' | 'or';
}
