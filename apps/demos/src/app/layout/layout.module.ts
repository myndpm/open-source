import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LayoutWrapperComponent } from './containers/wrapper/wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutWrapperComponent,
  ],
  exports: [
    LayoutWrapperComponent,
  ]
})
export class LayoutModule {}
