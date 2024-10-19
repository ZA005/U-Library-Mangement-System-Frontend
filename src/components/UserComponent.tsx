/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const UserComponent = () => {

    const [libraryCardNumber, setLibraryCardNumber] = useState('')
    const [schoolId, setSchoolId] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')

    const { userId } = useParams();
    const [errors, setError] = useState({
        libraryCardNumber: '',
        schoolId: '',
        status: ''
    })

    const navigator = useNavigate();

    function handleLibraryCardNum(e: React.ChangeEvent<HTMLInputElement>) {
        setLibraryCardNumber(e.target.value);
    }
    function handleSchoolId(e: React.ChangeEvent<HTMLInputElement>) {
        setSchoolId(e.target.value);
    }
    function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    return (
        <div className='container'>
            <div>
                <div>
                    <h2>Register</h2>
                    <form action="">
                        <div className="form-group">
                            <label htmlFor="">Library Card Number</label>
                            <input type="text" placeholder='Library Card number' name='libraryCardNumber' value={libraryCardNumber} onChange={handleLibraryCardNum} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Student Id</label>
                            <input type="text" placeholder='Enter Student Id' name='schoolId' value={schoolId} onChange={handleSchoolId} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="">password</label>
                            <input type="password" placeholder='Enter Password' name='password' value={password} onChange={handlePassword} />
                        </div>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default UserComponent