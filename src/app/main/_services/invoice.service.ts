import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Invoice } from '../_models/invoice.model';
import { element } from 'protractor';

export interface ITotals {
    taxTotal: number;
    netTotal: number;
    result: number;
}

@Injectable()
export class InvoiceService {
    invoiceLoaded = new Subject();
    allInvoices: Invoice[] = [];
    localStorageAvailable = false;
    allTotal: ITotals;

    taxOptions = [
        { tag: '0%', value: 0 },
        { tag: '10.5%', value: 10.5 },
        { tag: '21%', value: 21 },
        { tag: '27%', value: 27 },
    ];

    localStorageTitles = [
        'toLoad',
        'ready'
    ];

    constructor() {
        if (typeof (Storage) !== 'undefined') {
            this.localStorageAvailable = true;

            // Check local storage
            const localData = this.getFromLocalStorage(this.localStorageTitles[1]) ?
                this.getFromLocalStorage(this.localStorageTitles[1]) : [];
            localData.map(dataElement => this.allInvoices.push(
                new Invoice(dataElement)
            ));

        } else {
            this.localStorageAvailable = false;
            console.log('Local storage not available!');
        }

        // Execute when do next to invoiceLoaded
        this.invoiceLoaded.subscribe((el: Invoice[]) => {
            if (el.length > 0) {
                const oldArray = this.allInvoices;
                this.allInvoices = oldArray.concat(el);

                // Save in local storage
                this.addToLocalStorage(this.localStorageTitles[1], this.allInvoices);
            } else {
                this.allInvoices = [];
            }
        });

    }

    /**
     * Add "obj" to local storage with name "title".
     * @param title 
     * @param obj 
     */
    public addToLocalStorage(title: string, obj: any): void {
        if (this.localStorageAvailable) {
            localStorage.setItem(title, JSON.stringify(obj));
        }
    }

    /**
     * Get object saved by tag "title".
     * @param title 
     */
    public getFromLocalStorage(title: string): any {
        if (this.localStorageAvailable) {
            return JSON.parse(localStorage.getItem(title));
        }
        return [];
    }

    /**
     * Remove object with tag "title".
     * @param title 
     */
    public removeFromLocalStorage(title: string): void {
        if (this.localStorageAvailable) {
            localStorage.removeItem(title);
        }
    }

    /**
     * Just next new message to main subject.
     * @param invoicesArray 
     */
    public addToInvoicesLoaded(invoicesArray: Invoice[]) {
        this.invoiceLoaded.next(invoicesArray);
    }

    /**
     * Get totals to show on dashboard component.
     */
    public getTotals(): ITotals {

        let totalResult: ITotals = {
            taxTotal: 0,
            netTotal: 0,
            result: 0
        }

        this.allInvoices.forEach((elem: Invoice) => {
            totalResult.taxTotal += elem.getTax();
            totalResult.netTotal += elem.net;
            totalResult.result += elem.getTotal();
        });

        return totalResult;
    }

    // String's formatters

    public currencyFormat(number: number): string {
        return '$' + number.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    public percentFormat(number: number): string {
        return parseFloat(number.toString()).toFixed(2) + " %"
    }
}