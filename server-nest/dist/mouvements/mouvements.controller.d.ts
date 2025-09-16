import { MouvementsService } from './mouvements.service';
export declare class MouvementsController {
    private readonly service;
    constructor(service: MouvementsService);
    list(): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }[]>;
    create(req: any, body: any): Promise<{
        id: number;
        description: string | null;
        createdAt: Date;
        entrepriseId: number;
        userId: number | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        type: import("@prisma/client").$Enums.MouvementType;
    }>;
}
