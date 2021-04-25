import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

}
