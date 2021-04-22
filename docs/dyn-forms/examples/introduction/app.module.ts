import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { DynFormsMaterialModule } from "@myndpm/dyn-forms/ui-material";
import { AppComponent } from "./app.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynFormsMaterialModule.forFeature(),
    MatButtonModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        hideRequiredMarker: true,
        floatLabel: 'auto', // also set in INPUT.params.floatLabel
      },
    },
  ],
})
export class DemoFormsModule {}
