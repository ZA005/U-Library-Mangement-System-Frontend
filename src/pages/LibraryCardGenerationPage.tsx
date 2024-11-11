import React from 'react'
import UserService from '../services/UserService';
import { Link } from 'react-router-dom';

function LibraryCardGenerationPage() {
    const isAuthenticated = UserService.isAuthenticated();

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
        }

    };
    return (
        <div>
            {isAuthenticated && <Link to="/" onClick={handleLogout}>Logout</Link>}
        </div>
    )
}

export default LibraryCardGenerationPage