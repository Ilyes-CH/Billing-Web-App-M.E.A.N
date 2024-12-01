import { Injectable } from '@angular/core';

namespace Taxation {
  export declare interface Tax {
    TaxCalculator(taxRate: number, prices: Array<number>): number | Array<number>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetTaxValue implements Taxation.Tax {
  // Calculates the tax amount for a single price or a total before-tax amount
  TaxCalculator(taxRate: number, prices: Array<number>): number {
    const total = prices.reduce((sum, price) => sum + price, 0);
    const taxAmount = total * (taxRate / 100);
    return taxAmount;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetPriceAfterTax implements Taxation.Tax {
  // Returns an array of prices after applying the tax
  TaxCalculator(taxRate: number, services: Array<any>): Array<number> {
    return services.map(service => service.priceHT * (1 + taxRate / 100));
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetTotalBeforeTax implements Taxation.Tax {
  // Calculates the total of all item prices before tax
  TaxCalculator(taxRate: number, prices: Array<number>): number {
    return prices.reduce((sum, price) => sum + price, 0);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetTotalAfterTax implements Taxation.Tax {
  // Calculates the total after tax by adding the tax amount to the total before-tax price
  TaxCalculator(taxRate: number, prices: Array<number>): number {
    const totalBeforeTax = prices.reduce((sum, price) => sum + price, 0);
    const taxAmount = totalBeforeTax * (taxRate / 100);
    return totalBeforeTax + taxAmount;
  }
}
