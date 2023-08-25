import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { Observable } from 'rxjs';
import { SubmitBasics } from '../../../actions';
import { ProjectCreateState } from '../../../states';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  standalone: true,
  selector: 'wbs-project-create-basics',
  templateUrl: './basics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    EditorModule,
    FooterComponent,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class BasicsComponent {
  @Select(ProjectCreateState.description) description$!: Observable<string>;
  @Select(ProjectCreateState.title) title$!: Observable<string>;

  constructor(private readonly store: Store) {}

  nav(title: string, description: string): void {
    this.store.dispatch(new SubmitBasics(title.trim(), description.trim()));
  }
}
