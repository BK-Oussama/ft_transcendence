export interface Member {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    avatar?: string;
    joined_at: string;
}

