import {
  Component,
  OnInit,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import _ from 'lodash';

import { UselectDefaultConfig } from './../../classes/uselect-default-config.class';
import {
  IUselectData,
  IUselectServiceItem
} from './../../classes/uselect-service-items.interface';

@Component({
  selector: 'uselect',
  templateUrl: './uselect.component.html',
  styleUrls: ['./uselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UselectComponent),
      multi: true
    }
  ]
})
export class UselectComponent implements OnInit, ControlValueAccessor {
  @Input('placeholder') placeholder?: string;
  @Input('service') service: IUselectServiceItem;
  @Input('dropDownValue') dropDownValueFunc?: (IUselectData) => string;
  @Input('selectedValue') selectedValueFunc?: (IUselectData) => string;
  @Input('dropDownTemplate') dropDownTemplate?: TemplateRef<any>;
  @Input('selectTemplate') selectTemplate?: TemplateRef<any>;
  @Input('sortKey') sortKey?: string;
  @ViewChild('uselectSearch') uselectSearch: ElementRef;
  @HostListener('document:click', ['$event'])
  clickedOutside($event) {
    this.toggleDropDown(false);
  }
  private value: IUselectData[] | IUselectData; //for ngModel
  private items: IUselectData[]; //for service items
  private highlightedIndex: number = 0;
  private search: string;
  private isDropDownOpen: boolean = false;
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private defaultConfig: UselectDefaultConfig) {}

  ngOnInit() {
    if (!this.placeholder) this.placeholder = this.defaultConfig.placeholder;
    if (!this.service)
      throw new Error('Service for Uselect component are missed!');
    this.service.getItems(this.search).subscribe(data => (this.items = data));
  }

  writeValue(value: IUselectData[] | IUselectData): void {
    this.value = value;
    this.value = this.sortValue();
    this.normalizeSort();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  private sortValue(): IUselectData | IUselectData[] {
    if (!(this.value instanceof Array)) return <IUselectData>this.value;
    if (!this.sortKey) return <IUselectData[]>this.value;
    return _.sortBy(this.value, val => {
      if (
        !(val.value instanceof Object) ||
        !(<Object>val.value).hasOwnProperty(this.sortKey)
      )
        throw new Error(
          'Sort key must be a part of value. Ex: {id: 1, value: {string: "example", sort: 1}}.'
        );
      return val.value[this.sortKey];
    });
  }

  private normalizeSort(): void {
    if (this.value instanceof Array && this.sortKey) {
      for (let i = 0; i < this.value.length; i++) {
        this.value[i][this.sortKey] = i;
      }
      this.onChange(this.value);
    }
  }

  private dropDownValue(item: IUselectData): string {
    if (this.dropDownValueFunc) return this.dropDownValueFunc(item);
    return <string>item.value;
  }

  private selectedValue(item: IUselectData): string {
    if (this.selectedValueFunc) return this.selectedValueFunc(item);
    return <string>item.value;
  }

  private selectItem(item: IUselectData): boolean {
    if (this.isMultiple()) {
      if (this.isCurrent(item)) {
        _.remove(<IUselectData[]>this.value, val => val.id == item.id);
      } else (<IUselectData[]>this.value).push(item);
      this.normalizeSort();
    } else {
      this.value = item;
    }
    this.onChange(this.value);
    return false;
  }

  public removeItem(item: IUselectData): void {
    if (this.isMultiple()) {
      _.remove(<IUselectData[]>this.value, val => val.id == item.id);
    } else {
      this.value = undefined;
    }
    this.onChange(this.value);
  }

  private onSearchChange(): void {
    // @todo: bad solution
    this.service.getItems(this.search).subscribe(data => (this.items = data));
    this.highlightedIndex = 0;
  }

  public onItemDrop($event: any): void {
    this.normalizeSort();
  }

  private onSearchKeydown($event: KeyboardEvent): void {
    switch ($event.keyCode) {
      case 40: // keydown
        if (this.highlightedIndex < this.items.length - 1)
          this.highlightedIndex++;
        break;
      case 38: // keyup
        if (0 < this.highlightedIndex) this.highlightedIndex--;
        break;
      case 13: // enter
        this.selectItem(this.items[this.highlightedIndex]);
        break;
      case 27: // escape
        this.toggleDropDown(false);
        break;
    }
  }

  private isMultiple(): boolean {
    return this.value instanceof Array;
  }

  private toggleDropDown(isOpen: boolean = true, $event?: MouseEvent): void {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      if (
        'button' == $event.target['tagName'].toLowerCase() ||
        'button' == $event.target['parentNode']['tagName'].toLowerCase()
      )
        return;
    }
    this.isDropDownOpen = isOpen;
    if (isOpen) {
      setTimeout(_ => {
        this.uselectSearch.nativeElement.focus();
      });
    } else {
      this.search = '';
      this.onSearchChange();
    }
  }

  private isCurrent(item: IUselectData): boolean {
    if (!this.value) return false;
    if (this.isMultiple()) {
      return _.some(<IUselectData[]>this.value, val => val.id == item.id);
    }
    return (<IUselectData>this.value).id == item.id;
  }

  private allCheck(): boolean {
    return !!this.service;
  }

  private trackByIndex(index: number, obj: any): any {
    return index;
  }
}
