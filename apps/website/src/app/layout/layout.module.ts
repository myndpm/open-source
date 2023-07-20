import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SectionBadgesComponent } from './components/section-badges/section-badges.component';
import { SectionActionsComponent } from './components/section-actions/section-actions.component';
import { LayoutWrapperComponent } from './containers/wrapper/wrapper.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
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
