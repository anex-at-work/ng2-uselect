import { Observable } from 'rxjs/Observable';

export interface IUselectData {
  id: number | string | {};
}

export interface IUselectServiceItem {
  getItems(search?: string): Observable<IUselectData[]>;
}
