import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  StackblitzComponent,
  ViewerComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    StackblitzComponent,
    ViewerComponent,
  ],
})
export class DocsModule {}
