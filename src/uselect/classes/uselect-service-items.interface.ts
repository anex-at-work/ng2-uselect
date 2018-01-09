import { Observable } from 'rxjs/Observable';

export interface IUselectData {
  id: number | string | {};
  value: number | string | {} | [any];
}

export interface IUselectServiceItem {
  getItems(search?: string): Observable<IUselectData[]>;
}
