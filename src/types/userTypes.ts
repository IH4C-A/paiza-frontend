import type { Category } from "./categoryType";
import type { Rank } from "./rankType";

export type User = {
    user_id: string;
    username: string | null;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image?: string | null;
    age: number;
    seibetu: string;
    adrress: string;
    employment_status: string;
    ranks: Rank[];
    categories: Category[];
}

export type UserregisterPayload = {
    username: string | null;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    age: string;
    seibetu: string;
    adrress: string;
    employment_status: string;
}

export type UserLoginPayload = {
    email: string;
    password: string;
}

export type Loginuser = {
    user_id: string;
    first_name: string;
    rank: Rank;
}
