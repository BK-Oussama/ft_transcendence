import React from 'react';
import { ProfileSettingsForm } from '../components/ProfileSettingsForm';
import { EmailSettingsForm } from '../components/EmailSettingsForm';
import { PasswordSettingsForm } from '../components/PasswordSettingsForm';

export const SettingsPage = () => {
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
            `}</style>
        </div>
    );
};
