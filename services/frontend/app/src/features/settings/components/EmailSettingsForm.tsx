import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { updateEmailApi } from '../../../api/users.api';

export const EmailSettingsForm = () => {
    const { user, updateUser } = useAuth();

    const [email, setEmail] = useState(user?.email || '');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [fieldError, setFieldError] = useState('');

    const validate = () => {
        if (!email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
        if (email.length > 255) return 'Maximum 255 characters';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setFieldError(err); return; }
        setFieldError('');
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updateEmailApi({ email });
            updateUser({ email });
            setMessage({ type: 'success', text: 'Email updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update email' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sf-card">
            <h2 className="sf-card-title">Email Address</h2>

            {message.text && (
                <div className={`sf-alert sf-alert--${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <div className="sf-field">
                    <label htmlFor="sf-email" className="sf-label">Email Address</label>
                    <input
                        id="sf-email"
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setFieldError(''); }}
                        className={`sf-input${fieldError ? ' sf-input--error' : ''}`}
                        placeholder="example@example.com"
                        maxLength={255}
                        autoComplete="email"
                    />
                    {fieldError && <span className="sf-field-error">{fieldError}</span>}
                    <p className="sf-hint" style={{ marginTop: 6 }}>
                        You may be asked to verify your new email address.
                    </p>
                </div>

                <div className="sf-footer">
                    <button type="submit" disabled={loading} className="sf-btn-primary">
                        {loading ? 'Saving...' : 'Update Email'}
                    </button>
                </div>
            </form>

            <style>{SHARED_STYLES}</style>
        </div>
    );
};

/* Shared card styles — identical across all settings forms */
const SHARED_STYLES = `
.sf-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    padding: 28px 32px;
}
.sf-card-title {
    font-size: 16px; font-weight: 600; color: #111827;
    margin-bottom: 20px; padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}
.sf-alert { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.sf-alert--success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.sf-alert--error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.sf-field { margin-bottom: 16px; }
.sf-label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
.sf-input, .sf-textarea {
    width: 100%; padding: 9px 12px;
    font-size: 14px; color: #111827;
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 8px; outline: none; font-family: inherit;
    transition: border-color 0.15s, background 0.15s;
}
.sf-input:focus, .sf-textarea:focus {
    border-color: #4f6ef7; background: #fff;
    box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
}
.sf-input--error { border-color: #ef4444 !important; }
.sf-textarea { resize: vertical; }
.sf-field-error { font-size: 12px; color: #ef4444; margin-top: 4px; display: block; }
.sf-hint { font-size: 12px; color: #9ca3af; margin: 0; }
.sf-footer {
    display: flex; gap: 12px; align-items: center;
    padding-top: 8px; border-top: 1px solid #f0f0f0;
}
.sf-btn-primary {
    background: #4f6ef7; color: #fff; border: none;
    padding: 9px 24px; border-radius: 8px;
    font-size: 14px; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: background 0.15s;
}
.sf-btn-primary:hover:not(:disabled) { background: #3d5ce6; }
.sf-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.sf-btn-secondary {
    background: #fff; color: #374151; border: 1px solid #e5e7eb;
    padding: 9px 20px; border-radius: 8px;
    font-size: 14px; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: background 0.15s;
}
.sf-btn-secondary:hover { background: #f9fafb; }
@media (max-width: 560px) { .sf-card { padding: 20px 18px; } }
`;
