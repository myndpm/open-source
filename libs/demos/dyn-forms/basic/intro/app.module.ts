import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/legacy-form-field";
import { DynFormsModule } from "@myndpm/dyn-forms";
import { DynFormsMaterialModule } from "@myndpm/dyn-forms/ui-material";
import { DynFormsBasicComponent } from "./app.component";

// workaround not required in application
// https://github.com/angular/angular/issues/23609#issuecomment-407191955
export const DynMaterialControls = DynFormsMaterialModule.forFeature();

const EXAMPLES = [
  DynFormsBasicComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    DynFormsModule,
    DynMaterialControls,
  ],
  declarations: EXAMPLES,
  entryComponents: EXAMPLES,
  exports: EXAMPLES,
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
