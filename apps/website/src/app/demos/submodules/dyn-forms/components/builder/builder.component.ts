import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-form-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderComponent implements OnDestroy {

  ngOnDestroy(): void {
    console.clear();
  }
}
