import api from "./client";

export const updateProfileApi = async (data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    jobTitle?: string;
}) => {
    const res = await api.patch("/auth/users/me", data);
    return res.data;
};

export const updateEmailApi = async (data: { email: string }) => {
    const res = await api.patch("/auth/users/me/email", data);
    return res.data;
};

export const updatePasswordApi = async (data: { password: string }) => {
    const res = await api.patch("/auth/users/me/password", data);
    return res.data;
};