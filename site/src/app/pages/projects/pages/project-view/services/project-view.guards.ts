import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetApproval, SetApprovalView } from '../actions';

export const closeApprovalWindowGuard = () =>
  inject(Store).dispatch(new SetApproval());

export const setApprovalViewAsTask = () =>
  inject(Store).dispatch(new SetApprovalView('task'));

export const setApprovalViewAsProject = () =>
  inject(Store).dispatch(new SetApprovalView('project'));
