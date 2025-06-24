import type { User } from "./userTypes";

export type UserCategory = {
    user_category_id: string;
    user_id: User;
    category_id: string;
    category_name: string;
    category_code: string;
}


export type UserCategoryAll = {
    user_category_id: string;
    user_id: string;
    category_id: string;
    category_name: string;
}