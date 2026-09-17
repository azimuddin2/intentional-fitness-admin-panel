export type TRole = 'user' | 'trainer' | 'admin';

export type TStatus = 'ongoing' | 'confirmed' | 'blocked';

export type TGender = 'male' | 'female' | 'other';

export type TUser = {
    _id: string;
    name: string;
    email: string;
    phone: string;

    image: string | null;
    gender: TGender;

    password: string;
    confirmPassword: string;
    needsPasswordChange: boolean;
    passwordChangeAt?: Date;

    role: TRole;
    status: TStatus;

    isVerified: boolean;
    verification: {
        otp: string | number | null;
        expiresAt: Date;
        status: boolean;
    };

    loginWith: 'google' | 'apple' | 'credentials';

    trainer?: string | null;

    fcmToken?: string;
    notifications: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};