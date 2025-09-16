import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly service;
    constructor(service: AnalyticsService);
    summary(period?: string): Promise<{
        entreprises: number;
        revenusTotal: number;
        depensesTotal: number;
        soldeNet: number;
        growthPercent: number;
        depensesGrowthPercent: number;
        taxesDue: number;
    }>;
    monthly(months?: string): Promise<any[]>;
    sector(): Promise<any[]>;
    taxCompliance(): Promise<any[]>;
    cashflow(weeks?: string): Promise<any[]>;
    topEnterprises(): Promise<any[]>;
}
