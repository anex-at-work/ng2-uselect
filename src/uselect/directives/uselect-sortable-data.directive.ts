import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[uselectSortableData]'
})
export class UselectSortableDataDirective {
  @Input('uselectSortableData') uselectSortableData: any[];
  constructor(private el: ElementRef) {}

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): boolean {
    event.dataTransfer.effectAllowed = 'move';
    return true;
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent): boolean {
    return true;
  }
}
