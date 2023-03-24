import { Discussion } from './discussion.model';

export interface DiscussionViewModel extends Discussion {
  children: DiscussionViewModel[];
}
