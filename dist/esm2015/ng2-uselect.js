import { Injectable, Component, Input, ViewChild, ElementRef, HostListener, forwardRef, Directive, Output, EventEmitter, ContentChild, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { sortBy, remove, some } from 'lodash/lodash';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class UselectDefaultConfig {
    constructor() {
        this.placeholder = 'Select an item...';
        this.ignoreClickElements = [
            'a',
            'button',
            'input',
            'textarea',
            'select',
            'option',
            'label'
        ];
    }
}
UselectDefaultConfig.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class UselectComponent {
    /**
     * @param {?} defaultConfig
     */
    constructor(defaultConfig) {
        this.defaultConfig = defaultConfig;
        this.serviceMethod = 'getItems';
        this.itemId = 'id';
        this.servicePipe = res => {
            return res;
        };
        this.disabled = false;
        this.disableEmpty = false;
        this.search = '';
        this.isDropDownOpen = false;
        this.highlightedIndex = 0;
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._draggableIndexes = {
            start: undefined,
            over: undefined
        };
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    clickedOutside($event) {
        this.toggleDropDown(false);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.placeholder)
            this.placeholder = this.defaultConfig.placeholder;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        if (this.isMultiple() &&
            this.sortKey &&
            (/** @type {?} */ (this.value)).length) {
            this.value = /** @type {?} */ (sortBy(this.value, val => {
                if (!val)
                    return;
                if (!(val instanceof Object) ||
                    !(/** @type {?} */ (val)).hasOwnProperty(this.sortKey))
                    throw new Error('Sort key must be a part of item. Ex: {id: 1, value: {string: "example"}, sort: 1}.');
                return val[this.sortKey];
            }));
            this.normalizeSort();
        }
        else if (!this.isMultiple()) {
            if (!this.value)
                return;
            if (!this.isScalar() && !this.value[this.itemId])
                this.value = undefined;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onUselectIndexChange($event) {
        this._draggableIndexes.over = $event;
        if (this._draggableIndexes.over != this._draggableIndexes.start) {
            let /** @type {?} */ overEl = this.value[this._draggableIndexes.over];
            this.value[this._draggableIndexes.start][this.sortKey] = this._draggableIndexes.over;
            this.value[this._draggableIndexes.over][this.sortKey] = this._draggableIndexes.start;
            this.value[this._draggableIndexes.over] = this.value[this._draggableIndexes.start];
            this.value[this._draggableIndexes.start] = overEl;
            this._draggableIndexes.start = this._draggableIndexes.over;
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onUselectDragstart($event) {
        this._draggableIndexes.start = $event;
        this._draggableIndexes.over = undefined;
        this.toggleDropDown(false);
    }
    /**
     * @return {?}
     */
    normalizeSort() {
        if (this.isMultiple() && this.sortKey) {
            for (let /** @type {?} */ i = 0; i < (/** @type {?} */ (this.value)).length; i++) {
                this.value[i][this.sortKey] = i;
            }
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    dropDownValue(item) {
        if (this.dropDownValueFunc)
            return this.dropDownValueFunc(item);
        return /** @type {?} */ (item[this.itemId]);
    }
    /**
     * @param {?} item
     * @return {?}
     */
    selectedValue(item) {
        if (this.selectedValueFunc)
            return this.selectedValueFunc(item);
        return /** @type {?} */ (item[this.itemId]);
    }
    /**
     * @param {?} item
     * @return {?}
     */
    selectItem(item) {
        if (this.isMultiple()) {
            if (this.isCurrent(item)) {
                remove(/** @type {?} */ (this.value), val => val[this.itemId] == item[this.itemId]);
            }
            else {
                if (this.deleteKey && item[this.deleteKey])
                    item[this.deleteKey] = false;
                else
                    (/** @type {?} */ (this.value)).push(item);
            }
            this.normalizeSort();
        }
        else {
            if (this.isScalar())
                this.value = item[this.itemId];
            else
                this.value = item;
            if (this.deleteKey && this.value[this.deleteKey])
                this.value[this.deleteKey] = false;
            setTimeout(_ => {
                this.isDropDownOpen = false;
                if ('' != this.search) {
                    this.search = '';
                    this.onSearchChange();
                }
            });
        }
        this._onChange(this.value);
        return false;
    }
    /**
     * @param {?} item
     * @return {?}
     */
    removeItem(item) {
        if (this.disabled)
            return;
        if (this.isMultiple()) {
            if (this.deleteKey) {
                const /** @type {?} */ finded = (/** @type {?} */ (this.value)).find(val => val[this.itemId] == item[this.itemId]);
                finded[this.deleteKey] = true;
            }
            else {
                remove(/** @type {?} */ (this.value), val => val[this.itemId] == item[this.itemId]);
            }
            this.normalizeSort();
        }
        else {
            if (this.deleteKey)
                this.value[this.deleteKey] = true;
            else
                this.value = undefined;
        }
        this._onChange(this.value);
    }
    /**
     * @return {?}
     */
    onSearchChange() {
        if (!this.service[this.serviceMethod])
            throw new Error(`Method '${this.serviceMethod}' are missed in service`);
        this.service[this.serviceMethod]
            .apply(this.service, !!this.serviceMethodArgs && 0 != this.serviceMethodArgs.length
            ? this.serviceMethodArgs
            : [this.search])
            .pipe(res => this.servicePipe.apply(undefined, [res].concat(this.pipeArgs)))
            .subscribe(data => {
            this.items = /** @type {?} */ (data);
        });
        this.highlightedIndex = 0;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onItemDrop($event) {
        this.normalizeSort();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onSearchKeydown($event) {
        switch ($event.keyCode) {
            case 40:
                // keydown
                if (this.highlightedIndex < this.items.length - 1)
                    this.highlightedIndex++;
                break;
            case 38:
                // keyup
                if (0 < this.highlightedIndex)
                    this.highlightedIndex--;
                break;
            case 13:
                // enter
                this.selectItem(this.items[this.highlightedIndex]);
                break;
            case 27:
                // escape
                this.toggleDropDown(false);
                break;
        }
    }
    /**
     * @return {?}
     */
    isMultiple() {
        return this.value instanceof Array;
    }
    /**
     * @return {?}
     */
    isScalar() {
        return (!this.isMultiple() &&
            'object' !== typeof this.value &&
            'undefined' !== typeof this.value);
    }
    /**
     * @param {?=} isOpen
     * @param {?=} $event
     * @return {?}
     */
    toggleDropDown(isOpen = true, $event) {
        if (this.disabled || !this.service)
            return;
        if ($event) {
            if (-1 !==
                this.defaultConfig.ignoreClickElements.indexOf($event.target['tagName'].toLowerCase()) &&
                !$event.target['classList'].contains('uselect__btn-dropdown'))
                return;
            $event.preventDefault();
            $event.stopPropagation();
            if ('button' == $event.target['tagName'].toLowerCase() ||
                'button' == $event.target['parentNode']['tagName'].toLowerCase())
                return;
        }
        this.isDropDownOpen = isOpen;
        if (isOpen) {
            if (!this.items)
                this.onSearchChange();
            setTimeout(_ => {
                this.uselectSearch.nativeElement.focus();
            });
        }
        else {
            if ('' != this.search) {
                this.search = '';
                this.onSearchChange();
            }
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    isCurrent(item) {
        if (!this.value ||
            (this.value && this.deleteKey && this.value[this.deleteKey]))
            return false;
        if (this.isMultiple()) {
            if (0 == (/** @type {?} */ (this.value)).length)
                return false;
            return some(/** @type {?} */ (this.value), val => {
                return (val[this.itemId] == item[this.itemId] &&
                    (!this.deleteKey || !item[this.deleteKey]));
            });
        }
        if (this.isScalar() &&
            this.value == item[this.itemId] &&
            (!this.deleteKey || !item[this.deleteKey]))
            return true;
        return (/** @type {?} */ (this.value))[this.itemId] == item[this.itemId];
    }
    /**
     * @return {?}
     */
    arrValue() {
        return /** @type {?} */ (this.value);
    }
    /**
     * @param {?} index
     * @param {?} obj
     * @return {?}
     */
    trackByIndex(index, obj) {
        return index;
    }
}
UselectComponent.decorators = [
    { type: Component, args: [{
                selector: 'uselect',
                template: `<div
  class="uselect__holder"
  tabindex="0"
  [class.uselect__dropdown--open]="isDropDownOpen"
  [class.uselect__holder--disabled]="disabled">
  <div class="uselect__select input-group"
    [class.uselect___select--has-value]="(!isMultiple() && value) || (isMultiple() && 0 < arrValue().length)"
    (click)="toggleDropDown(true, $event)">
    <div class="form-control">
      <div *ngIf="value && isMultiple() && 0 < arrValue().length"
        class="uselect__selected-items"
        [uselectSortableData]="value">
        <ng-container
          *ngFor="let selectedItem of value; let i = index; trackByIndex">
          <div *ngIf="!deleteKey || !selectedItem[deleteKey]"
            class="uselect__select-item" [uselectSortableIndex]="sortKey ? i : undefined"
            (onUselectIndexChange)="onUselectIndexChange($event)"
            (onUselectDragstart)="onUselectDragstart($event)">
            <span class="uselect__select-item-template">
              <ng-container
                *ngTemplateOutlet="selectTemplate; context: {$implicit: selectedItem}"></ng-container>
              <ng-container
                *ngIf="!selectTemplate">
                {{selectedValue(selectedItem)}}
              </ng-container>
            </span>
            <div class="btn-group ml-auto">
              <button *ngIf="sortKey"
                type="button" class="btn btn-light btn-sm" aria-label="Move"
                uselectSortableHandle>
                <span aria-hidden="true">&#x2195;</span>
              </button>
              <button type="button" class="btn btn-light btn-sm" aria-label="Move"
                (click)="removeItem(selectedItem)">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        </ng-container>
      </div>
      <div *ngIf="value && !isMultiple() && (!deleteKey || !value[deleteKey])" class="uselect__selected-items">
        <div class="uselect__select-item">
          <ng-container
            *ngTemplateOutlet="selectTemplate; context: {$implicit: value}"></ng-container>
          <ng-container
            *ngIf="!selectTemplate">
            {{selectedValue(value)}}
          </ng-container>
          <div class="btn-group ml-auto">
            <button *ngIf="!disableEmpty"
              type="button" class="btn btn-light btn-sm" aria-label="Move"
              (click)="removeItem(selectedItem)">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
      </div>
      <div *ngIf="(!value || (deleteKey && (value && value[deleteKey]))) || 0 == arrValue().length"
        class="uselect__placeholder">
        {{placeholder}}
      </div>
    </div>
    <div *ngIf="service && isMultiple()" class="input-group-append">
      <button class="uselect__btn-dropdown btn btn-outline-secondary dropdown-toggle" type="button" (click)="toggleDropDown(!isDropDownOpen)"></button>
    </div>
  </div>
  <div class="uselect__dropdown form-control">
    <div class="uselect__search input-group">
      <input type="text" class="form-control"
        [(ngModel)]="search"
        (ngModelChange)="onSearchChange()"
        (keydown)="onSearchKeydown($event)"
        tabindex="0"
        #uselectSearch />
    </div>
    <div class="uselect__items">
      <div *ngFor="let dataItem of items; let i = index; trackByIndex"
        class="uselect__item"
        [class.uselect__item--selected]="isCurrent(dataItem)"
        [class.uselect__item--highlighted]="highlightedIndex == i"
        (click)="selectItem(dataItem)">
        <ng-container
          *ngTemplateOutlet="dropDownTemplate; context: {$implicit: dataItem}">
        </ng-container>
        <ng-container *ngIf="!dropDownTemplate">
          {{dropDownValue(dataItem)}}
        </ng-container>
      </div>
    </div>
  </div>
</div>
`,
                styles: [`:host{display:-webkit-box;display:-ms-flexbox;display:flex;max-height:100%}:host .uselect__holder{width:100%;position:relative}:host .uselect__holder.uselect__holder--disabled .form-control{background-color:#e9ecef;color:#212529}:host .uselect__holder.uselect__holder--disabled .form-control .btn{display:none}:host .uselect__holder .uselect__select{width:100%;max-height:100%}:host .uselect__holder .uselect__select>.form-control{padding:6px;max-height:100%}:host .uselect__holder .uselect__select .uselect__btn-dropdown{height:100%}:host .uselect__holder .uselect__select .uselect__selected-items{width:100%;max-height:100%;overflow:auto}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0 3px}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item+.uselect__select-item{margin-top:3px}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item.uselect__select-item--draggable{-webkit-transform:scale(.95);transform:scale(.95);border:1px dashed #cecece;border-radius:2px;background:rgba(255,255,255,.8)}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item span.uselect__select-item-template{width:100%;max-width:100%;overflow:hidden}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item .btn[uselectsortablehandle]{cursor:move}:host .uselect__holder .uselect__select .uselect__selected-items .uselect__select-item .btn[uselectsortablehandle]:hover{background-color:#f8f9fa;border-color:#f8f9fa}:host .uselect__holder .uselect__dropdown{position:absolute;z-index:2147483647;display:none}:host .uselect__holder.uselect__dropdown--open .uselect__select>div{border-bottom-left-radius:0}:host .uselect__holder.uselect__dropdown--open .uselect__select .uselect__btn-dropdown{border-bottom-right-radius:0}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown{display:block;border-top-left-radius:0;border-top-right-radius:0;border-top:none;padding:0;width:100%}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__search{width:100%;padding:5px}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items{max-height:33vh;overflow-x:hidden;overflow-y:auto}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:5px 8px}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item.uselect__item--highlighted,:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item:hover{cursor:pointer;background-color:#f8f9fa;color:#212529}:host .uselect__holder.uselect__dropdown--open .uselect__dropdown .uselect__items .uselect__item.uselect__item--selected{background-color:#007bff;color:#fff}`],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => UselectComponent),
                        multi: true
                    }
                ]
            },] },
];
/** @nocollapse */
UselectComponent.ctorParameters = () => [
    { type: UselectDefaultConfig, },
];
UselectComponent.propDecorators = {
    "placeholder": [{ type: Input, args: ['placeholder',] },],
    "service": [{ type: Input, args: ['service',] },],
    "serviceMethod": [{ type: Input, args: ['serviceMethod',] },],
    "serviceMethodArgs": [{ type: Input, args: ['serviceMethodArgs',] },],
    "itemId": [{ type: Input, args: ['itemId',] },],
    "servicePipe": [{ type: Input, args: ['pipe',] },],
    "pipeArgs": [{ type: Input, args: ['pipeArgs',] },],
    "dropDownValueFunc": [{ type: Input, args: ['dropDownValue',] },],
    "selectedValueFunc": [{ type: Input, args: ['selectedValue',] },],
    "dropDownTemplate": [{ type: Input, args: ['dropDownTemplate',] },],
    "selectTemplate": [{ type: Input, args: ['selectTemplate',] },],
    "sortKey": [{ type: Input, args: ['sortKey',] },],
    "disabled": [{ type: Input, args: ['disabled',] },],
    "disableEmpty": [{ type: Input, args: ['disableEmpty',] },],
    "deleteKey": [{ type: Input, args: ['deleteKey',] },],
    "uselectSearch": [{ type: ViewChild, args: ['uselectSearch',] },],
    "clickedOutside": [{ type: HostListener, args: ['document:click', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class UselectSortableDataDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragStart(event) {
        event.dataTransfer.effectAllowed = 'move';
        return true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragEnd(event) {
        return true;
    }
}
UselectSortableDataDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uselectSortableData]'
            },] },
];
/** @nocollapse */
UselectSortableDataDirective.ctorParameters = () => [
    { type: ElementRef, },
];
UselectSortableDataDirective.propDecorators = {
    "uselectSortableData": [{ type: Input, args: ['uselectSortableData',] },],
    "onDragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class UselectSortableHandle {
    constructor() {
        this._md = false;
    }
    /**
     * @return {?}
     */
    get isMouseDown() {
        return this._md;
    }
    /**
     * @return {?}
     */
    onmousedown() {
        this._md = true;
        return true;
    }
    /**
     * @return {?}
     */
    onmouseup() {
        this._md = false;
        return true;
    }
    /**
     * @return {?}
     */
    onmouseleave() {
        this._md = false;
        return true;
    }
}
UselectSortableHandle.decorators = [
    { type: Directive, args: [{
                selector: '[uselectSortableHandle]'
            },] },
];
/** @nocollapse */
UselectSortableHandle.propDecorators = {
    "onmousedown": [{ type: HostListener, args: ['mousedown',] },],
    "onmouseup": [{ type: HostListener, args: ['mouseup',] },],
    "onmouseleave": [{ type: HostListener, args: ['mouseleave',] },],
};
class UselectSortableIndexDirective {
    /**
     * @param {?} el
     */
    constructor(el) {
        this.el = el;
        this.uselectIndexChange = new EventEmitter();
        this.uselectDragstart = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        if (undefined == this.uselectSortableIndex)
            return true;
        if ((this.uselectSortableHandler &&
            this.uselectSortableHandler.isMouseDown) ||
            !this.uselectSortableHandler) {
            this.el.nativeElement.draggable = true;
            this.el.nativeElement.classList.add('uselect__select-item--draggable');
            this.uselectDragstart.emit(this.uselectSortableIndex);
        }
        return true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragEnd(event) {
        this.el.nativeElement.draggable = false;
        this.el.nativeElement.classList.remove('uselect__select-item--draggable');
        return true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragOver(event) {
        event.dataTransfer.dropEffect = 'move';
        this.uselectIndexChange.emit(this.uselectSortableIndex);
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDrag(event) {
        if (!event.target['classList'].contains('uselect__select-item')) {
            return true;
        }
        let /** @type {?} */ parent = event.target['closest']('.uselect__selected-items'), /** @type {?} */
        percent = 0.2;
        if (parent['offsetHeight'] * (1 - percent) <
            event.target['offsetTop'] - parent['scrollTop']) {
            parent['scrollTop'] = parent['scrollTop'] + event.target['offsetHeight'];
        }
        else if (parent['offsetHeight'] * percent >
            event.target['offsetTop'] - parent['scrollTop']) {
            parent['scrollTop'] = parent['scrollTop'] - event.target['offsetHeight'];
        }
        return true;
    }
}
UselectSortableIndexDirective.decorators = [
    { type: Directive, args: [{
                selector: '[uselectSortableIndex]',
                host: {
                    draggable: 'false',
                    uselectsortable: 'true'
                }
            },] },
];
/** @nocollapse */
UselectSortableIndexDirective.ctorParameters = () => [
    { type: ElementRef, },
];
UselectSortableIndexDirective.propDecorators = {
    "uselectSortableIndex": [{ type: Input, args: ['uselectSortableIndex',] },],
    "uselectIndexChange": [{ type: Output, args: ['onUselectIndexChange',] },],
    "uselectDragstart": [{ type: Output, args: ['onUselectDragstart',] },],
    "uselectSortableHandler": [{ type: ContentChild, args: [UselectSortableHandle,] },],
    "onMouseDown": [{ type: HostListener, args: ['mousedown', ['$event'],] },],
    "onDragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
    "onDragOver": [{ type: HostListener, args: ['dragover', ['$event'],] },],
    "onDrag": [{ type: HostListener, args: ['drag', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class UselectModule {
}
UselectModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, FormsModule],
                declarations: [
                    UselectComponent,
                    UselectSortableDataDirective,
                    UselectSortableIndexDirective,
                    UselectSortableHandle
                ],
                providers: [UselectDefaultConfig],
                exports: [UselectComponent]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { UselectModule, UselectDefaultConfig as ɵb, UselectComponent as ɵa, UselectSortableDataDirective as ɵc, UselectSortableHandle as ɵd, UselectSortableIndexDirective as ɵe };
//# sourceMappingURL=ng2-uselect.js.map
