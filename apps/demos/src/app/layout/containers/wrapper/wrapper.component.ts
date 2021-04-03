import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'layout-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutWrapperComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

}
