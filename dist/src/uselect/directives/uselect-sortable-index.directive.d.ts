import { EventEmitter, ElementRef } from '@angular/core';
export declare class UselectSortableHandle {
    readonly isMouseDown: boolean;
    private _md;
    onmousedown(): boolean;
    onmouseup(): boolean;
    onmouseleave(): boolean;
}
export declare class UselectSortableIndexDirective {
    private el;
    uselectSortableIndex: number;
    uselectIndexChange: EventEmitter<number>;
    uselectDragstart: EventEmitter<number>;
    uselectSortableHandler: UselectSortableHandle;
    constructor(el: ElementRef);
    onMouseDown(event: MouseEvent): boolean;
    onDragEnd(event: DragEvent): boolean;
    onDragOver(event: DragEvent): boolean;
}
