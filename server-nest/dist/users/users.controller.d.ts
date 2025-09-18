import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
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
    create(dto: CreateUserDto): Promise<{
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
    get(id: string): Promise<{
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
    update(id: string, dto: UpdateUserDto): Promise<{
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
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
