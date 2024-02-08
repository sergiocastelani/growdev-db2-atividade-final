export interface UserUpdateRequest 
{
    username: string;
    email: string;
    name: string;
    currentPassword: string;
    newPassword?: string;
    pictureUrl?: string;
}
