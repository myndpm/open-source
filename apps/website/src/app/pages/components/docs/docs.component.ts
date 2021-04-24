import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsIndexComponent {
  items = [
    {
      title: '@myndpm/dyn-forms',
      link: './dyn-forms',
      description: 'Abstract layer to easily generate Dynamic Forms for Angular with a brand-new standard opened for community contributions and feedback!',
    },
  ];
}
