import axios from 'axios';

const ALL_USER_URL = "http://localhost:9090/api/v1/users/list";
const USER_URL = "http://localhost:9090/api/v1/users/userinfo/";

class UserService{
    getAllUsers(){
        const token = localStorage.getItem('jwtToken');
        return axios.get(ALL_USER_URL, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getUserInformation(id){
      const token = localStorage.getItem('jwtToken');
      return axios.get(USER_URL+id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  }
}

export default new UserService()