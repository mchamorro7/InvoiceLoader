export class Invoice {
    number: number;
    net: number;
    taxPercent: number;

    constructor(data?: any) {
        Object.assign(this, {}, data);
    }

    public getTax(): any{
        return parseFloat((this.net*(this.taxPercent/100)).toFixed(2));
    }

    // Total = Net * (1 + % Tax / 100) (Round it at two decimals)
    public getTotal(): any{
        return parseFloat((this.net*(1 + this.taxPercent/100)).toString());
    }
}