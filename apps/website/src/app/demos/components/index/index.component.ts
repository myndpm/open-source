import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-demos-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexComponent {
  items = [
    {
      title: 'Simple Subscription Form',
      link: './dyn-forms/single-form',
      description: 'Simple dyn-forms demo with custom modes.',
    },
    {
      title: 'Simple Dynamic Form',
      link: './dyn-forms/simple-form',
      description: 'Simple dyn-forms demo with display mode.',
    },
    {
      title: 'Combo Selectors Form',
      link: './dyn-forms/combo-form',
      description: 'Demo of selector updated with another selection.',
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
