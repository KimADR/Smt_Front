import { PrismaService } from '../prisma.service';
export declare class MouvementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }[]>;
    createFromBody(body: any): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }>;
    createFromMultipart(rawBody: any): Promise<{
        description: string | null;
        id: number;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }>;
}
