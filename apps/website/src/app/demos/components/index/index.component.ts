import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-demos-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent {
  items = [
    {
      title: 'Simple Dynamic Form',
      link: './dyn-forms/simple-form',
      description: 'Simple dyn-forms demo with display mode.',
    },
    {
      title: 'Dynamic Stepper Form',
      link: './dyn-forms/stepper-form',
      description: 'Demo of dyn-forms under different router-outlets.',
    },
    {
      title: 'Config Builder Form',
      link: './dyn-forms/builder',
      description: 'Real use-case building a configuration with a custom condition and matcher.',
    },
  ];
}
