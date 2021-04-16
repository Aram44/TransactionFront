import axios from 'axios';

const ACCOUNT_API_BASE_URL = "http://localhost:9090/api/v1/account/user/";
const ACCOUNT_API_CREATE_URL = "http://localhost:9090/api/v1/account/create";
const ACCOUNT_API_REMOVE_URL = "http://localhost:9090/api/v1/account/remove/";

class AccountService{
    getAccounts(uid){
        const token = localStorage.getItem('jwtToken');
        return axios.get(ACCOUNT_API_BASE_URL+uid, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    crateAccount(uid){
        const credentials = JSON.stringify({
            uid: uid
        });
        const token = localStorage.getItem('jwtToken');
        return axios.post(ACCOUNT_API_CREATE_URL, credentials,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    removeAccount(id){
      const token = localStorage.getItem('jwtToken');
      return axios.get(ACCOUNT_API_REMOVE_URL+id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  }
}

export default new AccountService()