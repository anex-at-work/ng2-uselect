import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UselectComponent } from './components/uselect/uselect.component';
import { UselectDefaultConfig } from './classes/uselect-default-config.class';
import { FormsModule } from '@angular/forms';
import { UselectSortableDataDirective } from './directives/uselect-sortable-data.directive';
import {
  UselectSortableIndexDirective,
  UselectSortableHandle
} from './directives/uselect-sortable-index.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    UselectComponent,
    UselectSortableDataDirective,
    UselectSortableIndexDirective,
    UselectSortableHandle
  ],
  providers: [UselectDefaultConfig],
  exports: [UselectComponent]
})
export class UselectModule {}
