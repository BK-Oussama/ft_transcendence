import React from 'react';
import { ProfileSettingsForm } from '../components/settings/ProfileSettingsForm';
import { EmailSettingsForm } from '../components/settings/EmailSettingsForm';
import { PasswordSettingsForm } from '../components/settings/PasswordSettingsForm';
import { useAuth } from '../hooks/useAuth';
import { deleteAccountApi } from '../api/auth.api'; 
import toast from 'react-hot-toast';

export const SettingsPage = () => {
    const { logout, user } = useAuth();

    const handleDownloadData = () => {
        const dataToExport = {
            fullName: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
            jobTitle: user?.jobTitle || "Not specified",
            bio: user?.bio || "No bio provided",
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my_data.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Data export successful");
    };

    const handleDeleteAccount = async () => {
        const isConfirmed = window.confirm(
            "CRITICAL: This will permanently delete your account and all associated data. This action cannot be undone. Are you sure?"
        );

        if (isConfirmed) {
            try {
                // 1. Delete the user in the database
                await deleteAccountApi();
                toast.success("Account and data successfully purged.");
                
                // 2. Perform the robust logout immediately
                // This clears the token even if the logout API fails
                logout(); 
            } catch (err) {
                console.error("Deletion failed:", err);
                toast.error("Failed to delete account. The user may already be gone.");
                
                // 3. Fallback: If the user is already gone but the session is stuck,
                // force a local-only logout.
                logout();
            }
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-breadcrumb">
                <span className="breadcrumb-home">⌂</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">Account Settings</span>
            </div>

            <h1 className="settings-title">Account Settings</h1>

            <div className="settings-stack">
                <ProfileSettingsForm />
                <EmailSettingsForm />
                <PasswordSettingsForm />

                <div className="sf-card">
                    <h2 className="sf-card-title">Privacy & Data Portability</h2>
                    <p className="logout-hint" style={{ marginBottom: '15px' }}>
                        Download a copy of your personal data or exercise your right to be forgotten (GDPR).
                    </p>
                    <button onClick={handleDownloadData} className="sf-btn-gdpr">
                        Download My Data (JSON)
                    </button>
                </div>

                <div className="sf-card logout-card">
                    <h2 className="sf-card-title danger-title">Danger Zone</h2>
                    <p className="sf-hint logout-hint">
                        Deleting your account is permanent. All profile information and contributions will be removed.
                    </p>
                    <div className="danger-actions">
                        <button onClick={() => logout()} className="sf-btn-logout">
                            Log Out
                        </button>
                        <button onClick={handleDeleteAccount} className="sf-btn-delete">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .settings-page { background: #f4f5f7; height: 100%; overflow-y: auto; padding: 28px 40px 60px; font-family: sans-serif; }
                .settings-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6b7280; margin-bottom: 20px; }
                .settings-title { font-size: 22px; font-weight: 600; color: #111827; margin-bottom: 24px; }
                .settings-stack { display: flex; flex-direction: column; gap: 20px; max-width: 780px; }
                .sf-card { background: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); padding: 28px 32px; }
                .sf-card-title { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0; }
                .danger-title { color: #dc2626; }
                .logout-hint { margin-bottom: 20px; color: #6b7280; font-size: 14px; line-height: 1.5; }
                .danger-actions { display: flex; gap: 12px; }
                .sf-btn-logout { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; padding: 9px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .sf-btn-delete { background: white; color: #dc2626; border: 1px solid #dc2626; padding: 9px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
                .sf-btn-gdpr { background: #f9fafb; color: #374151; border: 1px solid #d1d5db; padding: 9px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
            `}</style>
        </div>
    );
};