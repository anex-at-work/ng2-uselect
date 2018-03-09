import { Injectable } from '@angular/core';

@Injectable()
export class UselectDefaultConfig {
  public placeholder: string = 'Select an item...';
  public ignoreClickElements: string[] = [
    'a',
    'button',
    'input',
    'textarea',
    'select',
    'option',
    'label'
  ];
}
