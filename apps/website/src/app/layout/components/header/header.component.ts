import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  menu = [
    {
      title: 'Docs',
      link: '/docs/dyn-forms',
    },
    {
      title: 'Demos',
      link: '/demos',
    },
  ];
}
