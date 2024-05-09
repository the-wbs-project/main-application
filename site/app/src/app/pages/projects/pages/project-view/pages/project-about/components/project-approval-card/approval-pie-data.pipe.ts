import { Pipe, PipeTransform } from '@angular/core';
import { ProjectApprovalStats } from '@wbs/main/models';

@Pipe({ name: 'approvalPieData', standalone: true })
export class ApprovalPieDataPipe implements PipeTransform {
  transform(stats: ProjectApprovalStats): { value: number; color: string }[] {
    return [
      { value: stats.approved, color: '#016a59' },
      { value: stats.rejected, color: '#f34343' },
      { value: stats.remaining, color: '#d6d6e6' },
    ];
  }
}
