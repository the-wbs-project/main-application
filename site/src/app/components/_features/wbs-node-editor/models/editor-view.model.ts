export type EDITOR_VIEW_TYPES =
  | 'General'
  | 'History'
  | 'TrainingMaterial'
  | 'Attachments';

export interface EditorView {
  id: EDITOR_VIEW_TYPES;
  label: string;
}
