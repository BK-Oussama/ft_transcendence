import React, { useState } from 'react';
import { updatePasswordApi } from '../../../api/users.api';

type Strength = { label: string; color: string; width: string };

const getStrength = (pwd: string): Strength => {
    if (!pwd) return { label: '', color: '#e5e7eb', width: '0%' };
    let score = 0;
    if (pwd.length >= 6)  score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map: Strength[] = [
        { label: '',       color: '#e5e7eb', width: '0%'   },
        { label: 'Weak',   color: '#ef4444', width: '25%'  },
        { label: 'Fair',   color: '#f59e0b', width: '50%'  },
        { label: 'Good',   color: '#10b981', width: '75%'  },
        { label: 'Strong', color: '#059669', width: '100%' },
    ];
    return map[score] ?? map[0];
};

export const PasswordSettingsForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const strength = getStrength(password);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (password.length < 6) errs.password = 'Minimum 6 characters required';
        if (password !== confirmPassword) errs.confirm = 'Passwords do not match';
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updatePasswordApi({ password });
            setPassword('');
            setConfirmPassword('');
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sf-card">
            <h2 className="sf-card-title">Change Password</h2>

            {message.text && (
                <div className={`sf-alert sf-alert--${message.type}`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="sf-field">
                    <label htmlFor="sf-newPassword" className="sf-label">New Password</label>
                    <div className="sf-input-wrap">
                        <input
                            id="sf-newPassword"
                            type={showPwd ? 'text' : 'password'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                            className={`sf-input sf-input-padded${errors.password ? ' sf-input--error' : ''}`}
                            placeholder="Min. 6 characters"
                            autoComplete="new-password"
                        />
                        <button type="button" className="sf-eye-btn" onClick={() => setShowPwd(v => !v)} aria-label="Toggle password visibility">
                            {showPwd ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {/* Strength bar */}
                    {password.length > 0 && (
                        <div className="sf-strength-wrap">
                            <div className="sf-strength-track">
                                <div className="sf-strength-fill" style={{ width: strength.width, background: strength.color }} />
                            </div>
                            {strength.label && (
                                <span className="sf-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                            )}
                        </div>
                    )}
                    {errors.password && <span className="sf-field-error">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="sf-field">
                    <label htmlFor="sf-confirmPassword" className="sf-label">Confirm New Password</label>
                    <div className="sf-input-wrap">
                        <input
                            id="sf-confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirm: '' })); }}
                            className={`sf-input sf-input-padded${errors.confirm ? ' sf-input--error' : ''}`}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                        />
                        <button type="button" className="sf-eye-btn" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password visibility">
                            {showConfirm ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.confirm && <span className="sf-field-error">{errors.confirm}</span>}
                </div>

                <div className="sf-footer">
                    <button type="submit" disabled={loading} className="sf-btn-primary">
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button type="button" className="sf-btn-secondary" onClick={() => {
                        setPassword(''); setConfirmPassword(''); setErrors({});
                    }}>
                        Cancel
                    </button>
                </div>
            </form>

            <style>{SHARED_STYLES}</style>
        </div>
    );
};

const SHARED_STYLES = `
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
.sf-alert { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.sf-alert--success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.sf-alert--error   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.sf-field { margin-bottom: 16px; }
.sf-label { display: flex; justify-content: space-between; font-size: 13px; font-weight: 500; color: #374151; margin-bottom: 6px; }
.sf-input-wrap { position: relative; }
.sf-input, .sf-textarea {
    width: 100%; padding: 9px 12px;
    font-size: 14px; color: #111827;
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 8px; outline: none; font-family: inherit;
    transition: border-color 0.15s, background 0.15s;
}
.sf-input-padded { padding-right: 40px; }
.sf-input:focus, .sf-textarea:focus {
    border-color: #4f6ef7; background: #fff;
    box-shadow: 0 0 0 3px rgba(79,110,247,0.1);
}
.sf-input--error { border-color: #ef4444 !important; }
.sf-eye-btn {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px;
    color: #9ca3af; line-height: 1;
}
.sf-eye-btn:hover { color: #374151; }
.sf-strength-wrap { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.sf-strength-track { flex: 1; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
.sf-strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
.sf-strength-label { font-size: 12px; font-weight: 500; min-width: 44px; }
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
