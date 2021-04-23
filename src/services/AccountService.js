import axios from 'axios';

const BASE_URL = "http://localhost:9090/api/v1/account/user/";
const CREATE_URL = "http://localhost:9090/api/v1/account/create";
const REMOVE_URL = "http://localhost:9090/api/v1/account/remove/";

class AccountService{
    getAccounts(uid){
        const token = localStorage.getItem('jwtToken');
        return axios.get(BASE_URL+uid, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    crateAccount(uid,currency){
        const credentials = JSON.stringify({
            uid: uid,
            currency: currency
        });
        const token = localStorage.getItem('jwtToken');
        return axios.post(CREATE_URL, credentials,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    removeAccount(id){
      const token = localStorage.getItem('jwtToken');
      return axios.get(REMOVE_URL+id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  }
}

export default new AccountService()