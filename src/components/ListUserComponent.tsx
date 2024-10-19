/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { listUsers } from '../services/UserService'
const ListUserComponent = () => {


  const navigator = useNavigate();

  useEffect(() => {
    getAllUsers();
  }, [])

  function getAllUsers() {
    listUsers().then((response) => {
      setUsers(response.data);
    }).catch(error => {
      console.error(error);
    })
  }

  const [users, setUsers] = useState([])

  useEffect(() => {
    listUsers().then((response) => {
      setUsers(response.data);
    }).catch(error => {
      console.error(error);
    })
  }, [])

  return (
    <div className='container'>
      <h2 className='text-center'>List of Employees</h2>
      {/* <button type="button" className="btn btn-primary mb-2" onClick={addNewEmployee}>Add Employee</button> */}
      <table className='table table-striped table-bordered'>
        <thead>
          <tr>
            <th>User Id</th>
            <th>Library Card Number</th>
            <th>School Id</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(user =>
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.libraryCardNumber}</td>
                <td>{user.schoolId}</td>
                <td>{user.userType}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  )
}

export default ListUserComponent