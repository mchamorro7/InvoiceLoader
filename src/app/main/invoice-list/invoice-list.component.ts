import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Invoice } from '../_models/invoice.model';
import { InvoiceService } from '../_services/invoice.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-invoice-list',
    templateUrl: 'invoice-list.component.html'
})

export class InvoiceListComponent implements OnInit, OnDestroy {
    invoiceForm: FormGroup;
    invoiceArray: Invoice[] = [];
    subscriptions: Subscription[] = [];

    constructor(private _formBuilder: FormBuilder,
        private invoiceService: InvoiceService) {
        this.createForm();

        //Check local storage
        const localData = this.invoiceService.getFromLocalStorage(this.invoiceService.localStorageTitles[0]) ?
            this.invoiceService.getFromLocalStorage(this.invoiceService.localStorageTitles[0]) : [];
        localData.map(dataElement => this.invoiceArray.push(
            new Invoice(dataElement)
        ));

    }

    ngOnInit() {
        // When detect changes on net or tax controls update total
        const netSubscription: Subscription = this.invoiceForm.controls.net.valueChanges.subscribe(() => {
            this.updateTotalFromForm();
        });

        const taxSubscription: Subscription = this.invoiceForm.controls.taxPercent.valueChanges.subscribe(() => {
            this.updateTotalFromForm();
        });

        this.subscriptions.push(netSubscription);
        this.subscriptions.push(taxSubscription);
    }

    ngOnDestroy() {
        // Unsubscribe all subscriptions when component been destroyed
        this.subscriptions.map(e => e.unsubscribe());
    }

    /**
     * Create form that will add invoices.
     */
    public createForm(): void {
        this.invoiceForm = this._formBuilder.group({
            number: ['', Validators.required],
            net: ['', Validators.required],
            taxPercent: ['', Validators.required],
            total: new FormControl({ value: '', disabled: true })
        })
    }

    /**
     * Clear form and uptate value and validity.
     */
    public clearForm(): void {
        this.invoiceForm.reset();
        this.invoiceForm.updateValueAndValidity();
    }

    /**
     * Add invoice to invoice's array to load with form values.
     */
    public addToInvoiceArray(): void {
        const data = Object.assign({}, this.invoiceForm.value);
        this.invoiceArray.push(
            new Invoice(data)
        );
        this.invoiceService.addToLocalStorage(this.invoiceService.localStorageTitles[0], this.invoiceArray);
    }

    /**
     * Remove selected item from invoice's array to load.
     * @param item 
     */
    public removeFromInvoiceArray(item: Invoice): void {
        const newArray: Invoice[] = this.invoiceArray.filter(e => e !== item);
        this.invoiceArray = newArray;
        this.invoiceService.addToLocalStorage(this.invoiceService.localStorageTitles[0], this.invoiceArray);
    }

    /**
     * Update total control value.
     */
    public updateTotalFromForm() {
        this.invoiceForm.controls.total.setValue(
            this.invoiceService.currencyFormat((this.invoiceForm.controls.net.value * 
                (1 + this.invoiceForm.controls.taxPercent.value / 100)))
        );
    }

    public storeInvoices(): void {
        this.invoiceService.removeFromLocalStorage(this.invoiceService.localStorageTitles[0]);
        this.invoiceService.addToInvoicesLoaded(this.invoiceArray);
    }

}