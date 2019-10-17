import { Component, OnInit } from '@angular/core';
import { InvoiceService, ITotals } from '../_services/invoice.service';
import { Invoice } from '../_models/invoice.model';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    invoicesLoaded: Invoice[] = [];
    allTotal: ITotals;

    constructor(private invoiceService: InvoiceService, private router: Router) {
        this.invoicesLoaded = this.invoiceService.allInvoices;
        this.allTotal = this.invoiceService.getTotals();
    }

    ngOnInit(): void { }

    /**
     * Reset all the work and clean local storage.
     */
    public deleteAllWork(): void {
        this.invoiceService.addToInvoicesLoaded([]);
        this.allTotal = {
            taxTotal: 0,
            netTotal: 0,
            result: 0
        };
        this.invoiceService.removeFromLocalStorage('ready');
        this.invoicesLoaded = [];
    }

    public goToPreviousPage() {
        this.router.navigateByUrl('');
    }

}