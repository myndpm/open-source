import { Injectable } from "@angular/core";
import { DynOption } from "@myndpm/dyn-forms/core";

@Injectable()
export class ComboService {

  getCountries(): DynOption<string>[] {
    return [
      { key: null, value: '- Choose one -' },
      { key: 'CO', value: 'Colombia' },
      { key: 'US', value: 'United States' },
      { key: 'RU', value: 'Rusia' },
      { key: 'UA', value: 'Ukraine' },
    ];
  }

  getCities(country?: string): DynOption<string>[] {
    if (!country) {
      return [];
    }

    switch (country) {
      case 'CO':
        return [
          { key: 'MDE', value: 'Medellin' },
          { key: 'BOG', value: 'Bogotá' },
        ];
      case 'US':
        return [
          { key: 'NYC', value: 'New York' },
          { key: 'OAK', value: 'Oakland' },
        ];
      case 'RU':
        return [
          { key: 'MSK', value: 'Moscow' },
          { key: 'SPB', value: 'Saint Petersburg' },
        ];
      case 'UA':
        return [
          { key: 'IEV', value: 'Kiev' },
          { key: 'KIV', value: 'Kharkiv' },
        ];
    }
  }

}