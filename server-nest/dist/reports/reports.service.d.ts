import { PrismaService } from '../prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(from?: string, to?: string): Promise<any[]>;
}
