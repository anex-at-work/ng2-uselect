import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ContentChild
} from '@angular/core';

@Directive({
  selector: '[uselectSortableHandle]'
})
export class UselectSortableHandle {
  get isMouseDown(): boolean {
    return this._md;
  }
  private _md: boolean = false;

  @HostListener('mousedown')
  onmousedown(): boolean {
    this._md = true;
    return true;
  }

  @HostListener('mouseup')
  onmouseup(): boolean {
    this._md = false;
    return true;
  }

  @HostListener('mouseleave')
  onmouseleave(): boolean {
    this._md = false;
    return true;
  }
}

@Directive({
  selector: '[uselectSortableIndex]',
  host: {
    draggable: 'false',
    uselectsortable: 'true'
  }
})
export class UselectSortableIndexDirective {
  @Input('uselectSortableIndex') uselectSortableIndex: number;
  @Output('onUselectIndexChange')
  uselectIndexChange = new EventEmitter<number>();
  @Output('onUselectDragstart') uselectDragstart = new EventEmitter<number>();
  @ContentChild(UselectSortableHandle)
  uselectSortableHandler: UselectSortableHandle;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): boolean {
    if (undefined == this.uselectSortableIndex) return true;
    if (
      (this.uselectSortableHandler &&
        this.uselectSortableHandler.isMouseDown) ||
      !this.uselectSortableHandler
    ) {
      this.el.nativeElement.draggable = true;
      this.el.nativeElement.classList.add('uselect__select-item--draggable');
      this.uselectDragstart.emit(this.uselectSortableIndex);
    }
    return true;
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent): boolean {
    this.el.nativeElement.draggable = false;
    this.el.nativeElement.classList.remove('uselect__select-item--draggable');
    return true;
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): boolean {
    event.dataTransfer.dropEffect = 'move';
    this.uselectIndexChange.emit(this.uselectSortableIndex);
    return false;
  }

  @HostListener('drag', ['$event'])
  onDrag(event: DragEvent): boolean {
    if (!event.target['classList'].contains('uselect__select-item')) {
      return true;
    }
    let parent: any = event.target['closest']('.uselect__selected-items'),
      percent: number = 0.2;
    if (
      parent['offsetHeight'] * (1 - percent) <
      event.target['offsetTop'] - parent['scrollTop']
    ) {
      parent['scrollTop'] = parent['scrollTop'] + event.target['offsetHeight'];
    } else if (
      parent['offsetHeight'] * percent >
      event.target['offsetTop'] - parent['scrollTop']
    ) {
      parent['scrollTop'] = parent['scrollTop'] - event.target['offsetHeight'];
    }
    return true;
  }
}
