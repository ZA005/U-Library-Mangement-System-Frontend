import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate(-1);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '3rem', color: '#ff0000' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#333' }}>Page Not Found</p>
            <p style={{ color: '#666' }}>
                The page you are looking for does not exist or has been moved.
            </p>
            <button
                onClick={handleGoHome}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Go to Home
            </button>
        </div>
    );
};

export default PageNotFound;
