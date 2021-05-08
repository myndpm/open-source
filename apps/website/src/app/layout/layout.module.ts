import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
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
import { MatDialogModule } from '@angular/material/dialog';
import { PromptDialog } from './components';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutWrapperComponent,
    SectionBadgesComponent,
    SectionActionsComponent,
    PromptDialog,
  ],
  exports: [
    LayoutWrapperComponent,
    SectionBadgesComponent,
    SectionActionsComponent,
    PromptDialog,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class LayoutModule {}
