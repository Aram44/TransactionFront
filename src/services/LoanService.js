import axios from 'axios';

const BASE_URL = "http://localhost:9090/api/v1/loan/allloans/";
const SET_URL = "http://localhost:9090/api/v1/loan/loan/";
const FILTER_URL = "http://localhost:9090/api/v1/loan/filter/";
const UPDATE_URL = "http://localhost:9090/api/v1/loan/update/";
const VIEW_URL = "http://localhost:9090/api/v1/loan/view/";
const ACTION_URL = "http://localhost:9090/api/v1/loan/loan/";

class LoanService{
    getAllLoans(page){
        const token = localStorage.getItem('jwtToken');
        return axios.get(BASE_URL+"?page="+page, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getAllLoanById(uid){
        const token = localStorage.getItem('jwtToken');
        return axios.get(SET_URL+uid,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getLoanById(id){
        const token = localStorage.getItem('jwtToken');
        return axios.get(VIEW_URL+id,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getFilter(start,finish,status,page){
        let param = "?start="+start+"&finish="+finish+"&status="+status+"&page="+page;
        const token = localStorage.getItem('jwtToken');
        return axios.get(FILTER_URL+param,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getFilterUid(start,finish,uid){
        let param = "?start="+start+"&finish="+finish+"&uid="+uid;
        const token = localStorage.getItem('jwtToken');
        return axios.get(FILTER_URL+param,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    setLoans(sid,rid,bal,type){
        const credentials = JSON.stringify({
            sender: sid,
            receiver: rid,
            balance: bal,
            status: type
        });
        const token = localStorage.getItem('jwtToken');
        axios.post(SET_URL, credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }
    updateLoans(sid,rid,bal,type){
        const credentials = JSON.stringify({
            sender: sid,
            receiver: rid,
            balance: bal,
            status: type
        });
        const token = localStorage.getItem('jwtToken');
        axios.post(UPDATE_URL, credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }
    action(id,action){
        const token = localStorage.getItem('jwtToken');
        return axios.get(ACTION_URL+action+"/"+id,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
}

export default new LoanService()