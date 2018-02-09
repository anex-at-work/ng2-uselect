import { ElementRef } from '@angular/core';
export declare class UselectSortableDataDirective {
    private el;
    uselectSortableData: any[];
    constructor(el: ElementRef);
    onDragStart(event: DragEvent): boolean;
    onDragEnd(event: DragEvent): boolean;
}
