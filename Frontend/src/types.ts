export interface User {
    _id: string;
    name: string;
    email: string;
    username: string;
    avatar?: string;
}

export interface SocialLink {
    platform: string;
    url: string;
    _id?: string;
}

export interface Profile {
    _id: string;
    user: User;
    bio?: string;
    title?: string;
    locations?: string; // Stored as simple string based on model
    resume?: string;
    socialLinks?: SocialLink[];
    createdAt: string;
    updatedAt: string;
}
