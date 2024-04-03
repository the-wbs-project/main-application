import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Category } from '@wbs/core/models';
import { CategoryState } from '../category-state.service';

export const projectCategoryResolver: ResolveFn<Category[]> = () =>
  inject(CategoryState).projectCategories;
