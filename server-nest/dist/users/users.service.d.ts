import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        phone: string | null;
        id: number;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }[]>;
    create(input: any): Promise<{
        phone: string | null;
        id: number;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    get(id: number): Promise<{
        phone: string | null;
        id: number;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    update(id: number, input: any): Promise<{
        phone: string | null;
        id: number;
        createdAt: Date;
        username: string;
        email: string;
        fullName: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    remove(id: number): Promise<void>;
}
