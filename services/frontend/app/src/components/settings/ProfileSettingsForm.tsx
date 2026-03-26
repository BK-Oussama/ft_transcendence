import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateProfileApi, uploadAvatarApi } from '../../api/users.api';

export const ProfileSettingsForm = () => {
    const { user, updateUser } = useAuth();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = () => {
        const f = firstName.trim();
        const l = lastName.trim();
        return ((f[0] || '') + (l[0] || '')).toUpperCase() || '?';
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (firstName.trim().length < 2) errs.firstName = 'Minimum 2 characters';
        if (firstName.trim().length > 50) errs.firstName = 'Maximum 50 characters';
        if (lastName.trim().length < 2) errs.lastName = 'Minimum 2 characters';
        if (lastName.trim().length > 50) errs.lastName = 'Maximum 50 characters';
        if (bio.length > 200) errs.bio = 'Maximum 200 characters';
        if (jobTitle.length > 100) errs.jobTitle = 'Maximum 100 characters';
        return errs;
    };

    const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local
        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result as string;
            setAvatarPreview(result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        try {
            setLoading(true);
            const { avatarUrl: newUrl } = await uploadAvatarApi(file);
            updateUser({ avatarUrl: newUrl });
            setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to upload avatar' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const updatedUser = await updateProfileApi({ firstName, lastName, jobTitle, bio });
            updateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sf-card">
            <h2 className="sf-card-title">Profile Information</h2>

            {message.text && (
                <div className={`sf-alert sf-alert--${message.type}`}>{message.text}</div>
            )}

            {/* Avatar */}
            <div className="sf-avatar-section">
                <div className="sf-avatar" onClick={() => fileInputRef.current?.click()}>
                    {avatarPreview
                        ? <img src={avatarPreview} alt="Avatar" className="sf-avatar-img" />
                        : <span className="sf-avatar-initials">{getInitials()}</span>
                    }
                    <div className="sf-avatar-overlay">Change</div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarFileChange}
                />
                <div className="sf-avatar-meta">
                    <button type="button" className="sf-link-btn" onClick={() => fileInputRef.current?.click()}>
                        Change Picture
                    </button>
                    <p className="sf-hint">JPG, PNG up to 5MB.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="sf-row-2">
                    <div className="sf-field">
                        <label htmlFor="sf-firstName" className="sf-label">First Name</label>
                        <input
                            id="sf-firstName"
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className={`sf-input${errors.firstName ? ' sf-input--error' : ''}`}
                            placeholder="Jane"
                            maxLength={50}
                        />
                        {errors.firstName && <span className="sf-field-error">{errors.firstName}</span>}
                    </div>
                    <div className="sf-field">
                        <label htmlFor="sf-lastName" className="sf-label">Last Name</label>
                        <input
                            id="sf-lastName"
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className={`sf-input${errors.lastName ? ' sf-input--error' : ''}`}
                            placeholder="Doe"
                            maxLength={50}
                        />
                        {errors.lastName && <span className="sf-field-error">{errors.lastName}</span>}
                    </div>
                </div>

                <div className="sf-field">
                    <label htmlFor="sf-jobTitle" className="sf-label">Job Title</label>
                    <input
                        id="sf-jobTitle"
                        type="text"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        className={`sf-input${errors.jobTitle ? ' sf-input--error' : ''}`}
                        placeholder="e.g. Product Manager"
                        maxLength={100}
                    />
                    {errors.jobTitle && <span className="sf-field-error">{errors.jobTitle}</span>}
                </div>

                <div className="sf-field">
                    <label htmlFor="sf-bio" className="sf-label">
                        Bio
                        <span className="sf-char-count">{bio.length}/200</span>
                    </label>
                    <textarea
                        id="sf-bio"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className={`sf-textarea${errors.bio ? ' sf-input--error' : ''}`}
                        placeholder="A short description about yourself..."
                        maxLength={200}
                        rows={3}
                    />
                    {errors.bio && <span className="sf-field-error">{errors.bio}</span>}
                </div>


                <div className="sf-footer">
                    <button type="submit" disabled={loading} className="sf-btn-primary">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="sf-btn-secondary" onClick={() => {
                        setFirstName(user?.firstName || '');
                        setLastName(user?.lastName || '');
                        setJobTitle(user?.jobTitle || '');
                        setBio(user?.bio || '');
                        setAvatarPreview(user?.avatarUrl || '');
                        setErrors({});
                    }}>
                        Cancel
                    </button>
                </div>
            </form>

            <style>{CARD_STYLES}</style>
        </div>
    );
};

const CARD_STYLES = `
.sf-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    padding: 28px 32px;
}
.sf-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}
.sf-alert {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
}
.sf-alert--success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.sf-alert--error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.sf-avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
}
.sf-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #e8eaf6;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid #e5e7eb;
}
.sf-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.sf-avatar-initials { font-size: 22px; font-weight: 600; color: #4f6ef7; }
.sf-avatar-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.45);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.15s;
    border-radius: 50%;
}
.sf-avatar:hover .sf-avatar-overlay { opacity: 1; }
.sf-avatar-meta { display: flex; flex-direction: column; gap: 4px; }
.sf-link-btn {
    background: none; border: none; padding: 0;
    color: #4f6ef7; font-size: 13px; font-weight: 500;
    cursor: pointer; text-align: left;
}
.sf-link-btn:hover { text-decoration: underline; }
.sf-hint { font-size: 12px; color: #9ca3af; margin: 0; }
.sf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.sf-field { margin-bottom: 16px; }
.sf-label {
    display: flex; justify-content: space-between;
    font-size: 13px; font-weight: 500; color: #374151;
    margin-bottom: 6px;
}
.sf-char-count { font-weight: 400; color: #9ca3af; }
.sf-input, .sf-textarea {
    width: 100%; padding: 9px 12px;
    font-size: 14px; color: #111827;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.15s, background 0.15s;
}
.sf-input:focus, .sf-textarea:focus {
    border-color: #4f6ef7;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
}
.sf-input--error { border-color: #ef4444 !important; }
.sf-textarea { resize: vertical; }
.sf-field-error { font-size: 12px; color: #ef4444; margin-top: 4px; display: block; }
.sf-footer {
    display: flex; gap: 12px; align-items: center;
    padding-top: 8px; margin-top: 4px;
    border-top: 1px solid #f0f0f0;
}
.sf-btn-primary {
    background: #4f6ef7; color: #fff;
    border: none; padding: 9px 24px;
    border-radius: 8px; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s;
}
.sf-btn-primary:hover:not(:disabled) { background: #3d5ce6; }
.sf-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.sf-btn-secondary {
    background: #fff; color: #374151;
    border: 1px solid #e5e7eb;
    padding: 9px 20px; border-radius: 8px;
    font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s;
}
.sf-btn-secondary:hover { background: #f9fafb; }
@media (max-width: 560px) {
    .sf-row-2 { grid-template-columns: 1fr; }
    .sf-card { padding: 20px 18px; }
}
`;
