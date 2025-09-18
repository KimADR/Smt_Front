import { PrismaService } from '../prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(period?: string): Promise<{
        entreprises: number;
        revenusTotal: number;
        depensesTotal: number;
        soldeNet: number;
        growthPercent: number;
        depensesGrowthPercent: number;
        taxesDue: number;
    }>;
    monthly(months?: number): Promise<any[]>;
    sector(): Promise<any[]>;
    taxCompliance(): Promise<any[]>;
    cashflow(weeks?: number): Promise<any[]>;
    topEnterprises(): Promise<any[]>;
    alerts(): Promise<any[]>;
}
