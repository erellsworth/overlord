import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentEditorComponent } from './content-editor/content-editor.component';
import { UiModule } from './ui/ui.module';

@NgModule({
  entryComponents: [ContentEditorComponent],
  declarations: [ContentEditorComponent],
  imports: [
    UiModule,
    CommonModule
  ],
  exports: [ContentEditorComponent]
})
export class SharedModule { }
