import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:9090/api/v1/users/allusers";

class UserService{
    getAllUsers(){
        const token = localStorage.getItem('jwtToken');
        return axios.get(USER_API_BASE_URL, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
}

export default new UserService()