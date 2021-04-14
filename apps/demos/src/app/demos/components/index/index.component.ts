import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent {
  items = [
    {
      title: 'Simple Dynamic Form',
      link: './dyn-forms/simple-form',
      description: 'Simple dyn-forms demo.',
    },
    {
      title: 'Dynamic Stepper Form',
      link: './dyn-forms/stepper-form',
      description: 'Demo of dyn-forms under different router-outlets.',
    },
  ];
}
