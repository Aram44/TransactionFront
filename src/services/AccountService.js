import axios from 'axios';

const BASE_ALL_URL = "http://localhost:9090/api/v1/account/list";
const FILTER_URL = "http://localhost:9090/api/v1/account/find";
const BASE_URL = "http://localhost:9090/api/v1/account/user/";
const CREATE_URL = "http://localhost:9090/api/v1/account/create";
const REMOVE_URL = "http://localhost:9090/api/v1/account/remove/";

class AccountService{
    getAllAccounts(){
      const token = localStorage.getItem('jwtToken');
      return axios.get(BASE_ALL_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    }
    getAccounts(uid){
      const token = localStorage.getItem('jwtToken');
      return axios.get(BASE_URL+uid, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
    }
    getAllByFilter(uid,currency,page){
      let param = "?uid="+uid+"&currency="+currency+"&page="+page;
      const token = localStorage.getItem('jwtToken');
      return axios.get(FILTER_URL+param,{
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
    crateAccount(uid,currency){
        const credentials = JSON.stringify({
            currency: currency,
            user:{
              id: uid,
            }
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