import React, { useState } from 'react'

interface LoginFormProps {
    onLogin: (libraryCardNumber: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [libraryCardNumber, setLibraryCardNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (libraryCardNumber.trim() === '' || password.trim() === '') {
            setError('Please fill in both fields');
        } else {
            setError(null);
            onLogin(libraryCardNumber, password);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <div>
                <label htmlFor="libraryCardNumber">Library Card Number:</label>
                <input
                    type="text"
                    id="libraryCardNumber"
                    value={libraryCardNumber}
                    onChange={(e) => setLibraryCardNumber(e.target.value)}
                    placeholder="Enter your library card number"
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;