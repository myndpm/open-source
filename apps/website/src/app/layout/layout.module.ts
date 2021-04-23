import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SectionBadgesComponent } from './components/section-badges/section-badges.component';
import { SectionActionsComponent } from './components/section-actions/section-actions.component';
import { LayoutWrapperComponent } from './containers/wrapper/wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutWrapperComponent,
    SectionBadgesComponent,
    SectionActionsComponent,
  ],
  exports: [
    LayoutWrapperComponent,
    SectionBadgesComponent,
    SectionActionsComponent,
  ]
})
export class LayoutModule {}
