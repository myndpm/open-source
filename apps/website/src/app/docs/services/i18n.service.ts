import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  get lang(): string {
    return this.locale?.slice(0, 2) ?? 'en';
  }

  constructor(
    @Inject(LOCALE_ID) private locale: string,
  ) {}
}
