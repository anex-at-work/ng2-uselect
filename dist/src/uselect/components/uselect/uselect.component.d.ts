import { OnInit, TemplateRef, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UselectDefaultConfig } from './../../classes/uselect-default-config.class';
import { IUselectData, IUselectServiceItem } from './../../classes/uselect-service-items.interface';
export declare class UselectComponent implements OnInit, ControlValueAccessor {
    private defaultConfig;
    placeholder?: string;
    service?: IUselectServiceItem;
    serviceMethod?: string;
    serviceMethodArgs?: any[];
    itemId?: string;
    servicePipe?: (Observable, any?) => Observable<IUselectData[]>;
    pipeArgs?: any[];
    dropDownValueFunc?: (IUselectData) => string;
    selectedValueFunc?: (IUselectData) => string;
    dropDownTemplate?: TemplateRef<any>;
    selectTemplate?: TemplateRef<any>;
    sortKey?: string;
    disabled?: boolean;
    disableEmpty?: boolean;
    uselectSearch: ElementRef;
    clickedOutside($event: any): void;
    value: IUselectData[] | IUselectData;
    items: IUselectData[];
    search: string;
    isDropDownOpen: boolean;
    private highlightedIndex;
    private _onChange;
    private _onTouched;
    private _draggableIndexes;
    constructor(defaultConfig: UselectDefaultConfig);
    ngOnInit(): void;
    writeValue(value: IUselectData[] | IUselectData): void;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: any): void;
    private onUselectIndexChange($event);
    private onUselectDragstart($event);
    private normalizeSort();
    private dropDownValue(item);
    private selectedValue(item);
    private selectItem(item);
    removeItem(item: IUselectData): void;
    onSearchChange(): void;
    onItemDrop($event: any): void;
    onSearchKeydown($event: KeyboardEvent): void;
    isMultiple(): boolean;
    toggleDropDown(isOpen?: boolean, $event?: MouseEvent): void;
    private isCurrent(item);
    arrValue(): IUselectData[];
    trackByIndex(index: number, obj: any): any;
}
