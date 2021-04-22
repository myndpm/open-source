import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { formConfig } from "./form.config";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  form = new FormGroup({});
  config = formConfig();

  doSubmit(): void {
    console.log(this.form.value);
  }
}
