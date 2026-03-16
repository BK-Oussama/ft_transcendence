import api from "./client";

export const updateProfileApi = async (data: {
    firstName?: string;
    lastName?: string;
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

export const updatePasswordApi = async (data: { password: string; currentPassword: string }) => {
    const res = await api.patch("/auth/users/me/password", data);
    return res.data;
};

export const uploadAvatarApi = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post("/auth/users/me/avatar", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};