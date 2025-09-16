import { PrismaService } from '../prisma.service';
export declare class MouvementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }[]>;
    createFromBody(body: any): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }>;
    createFromMultipart(rawBody: any): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }>;
}
