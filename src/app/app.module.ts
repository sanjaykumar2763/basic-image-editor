import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { ColorPickerModule } from "ngx-color-picker";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ColorPickerModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
