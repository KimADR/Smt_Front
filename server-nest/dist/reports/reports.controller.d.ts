import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly service;
    constructor(service: ReportsService);
    list(from?: string, to?: string): Promise<any[]>;
}
