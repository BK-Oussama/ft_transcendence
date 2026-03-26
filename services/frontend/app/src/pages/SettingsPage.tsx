import React from 'react';
import { ProfileSettingsForm } from '../components/settings/ProfileSettingsForm';
import { EmailSettingsForm } from '../components/settings/EmailSettingsForm';
import { PasswordSettingsForm } from '../components/settings/PasswordSettingsForm';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage = () => {
    const { logout } = useAuth();
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

                <div className="sf-card logout-card">
                    <h2 className="sf-card-title danger-title">Danger Zone</h2>
                    <p className="sf-hint logout-hint">Logging out will end your current session and require you to sign in again.</p>
                    <button
                        onClick={() => logout()}
                        className="sf-btn-logout"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <style>{`
                .settings-page {
                    background: #f4f5f7;
                    height: 100%;
                    overflow-y: auto;
                    padding: 28px 40px 60px;
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                }
                .settings-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 20px;
                }
                .breadcrumb-home { font-size: 14px; }
                .breadcrumb-sep { color: #9ca3af; }
                .breadcrumb-current { color: #374151; font-weight: 500; }
                .settings-title {
                    font-size: 22px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 24px;
                }
                .settings-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    max-width: 780px;
                }
                .sf-card {
                    background: #ffffff; border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
                    padding: 28px 32px;
                }
                .sf-card-title {
                    font-size: 16px; font-weight: 600; color: #111827;
                    margin-bottom: 20px; padding-bottom: 16px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .danger-title { color: #dc2626; }
                .logout-hint { margin-bottom: 20px; color: #6b7280; font-size: 14px; }
                .sf-btn-logout {
                    background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;
                    padding: 9px 24px; border-radius: 8px;
                    font-size: 14px; font-weight: 500; cursor: pointer;
                    transition: all 0.15s;
                }
                .sf-btn-logout:hover {
                    background: #dc2626; color: #fff; border-color: #dc2626;
                }
            `}</style>
        </div>
    );
};