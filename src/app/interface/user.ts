export interface User {
    id:number;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
    title?: string;
    bio?: string;
    imageUrl?: string;
    enabled: boolean;
    isNotLocked: boolean;
    usingMfa?: boolean;/*multifactor authentication*/
    createdAt?: Date;
    roleName: string;
    permission: string;
}
