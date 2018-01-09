import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UselectComponent } from './components/uselect/uselect.component';
import { UselectDefaultConfig } from './classes/uselect-default-config.class';
import { FormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';

@NgModule({
  imports: [CommonModule, FormsModule, DndModule.forRoot()],
  declarations: [UselectComponent],
  providers: [UselectDefaultConfig],
  exports: [UselectComponent, DndModule]
})
export class UselectModule {}
