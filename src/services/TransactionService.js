import axios from 'axios';

const BASE_URL = "http://localhost:9090/api/v1/alltransactions/";
const SET_URL = "http://localhost:9090/api/v1/transaction/";
const FILTER_URL = "http://localhost:9090/api/v1/filter/";
const UPDATE_URL = "http://localhost:9090/api/v1/transaction/update/";
const VIEW_URL = "http://localhost:9090/api/v1/transaction/view/";
const ACTION_URL = "http://localhost:9090/api/v1/transaction/";

class TransactionService{
    getAllTransactions(page){
        const token = localStorage.getItem('jwtToken');
        return axios.get(BASE_URL+"?page="+page, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getAllTransactionById(uid,page){
        const token = localStorage.getItem('jwtToken');
        return axios.get(SET_URL+uid+"?page="+page,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getTransactionById(id){
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
    getFilterUid(start,finish,status,uid,page){
        let param = "?start="+start+"&finish="+finish+"&status="+status+"&uid="+uid+"&page="+page;
        const token = localStorage.getItem('jwtToken');
        return axios.get(FILTER_URL+param,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    setTransactions(sid,rid,bal,type){
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
    updateTransactions(sid,rid,bal,type){
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

export default new TransactionService()