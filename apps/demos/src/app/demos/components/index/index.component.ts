import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'web-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent {
  items = [
    {
      title: 'Simple Dynamic Form',
      link: './dyn-forms/simple-form',
      description: 'Simple Dynamic Forms Demo.',
    },
  ];
}
