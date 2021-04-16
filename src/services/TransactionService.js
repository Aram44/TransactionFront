import axios from 'axios';

const TRANASACTION_API_BASE_URL = "http://localhost:9090/api/v1/alltransactions/";
const TRANASACTION_API_SET_URL = "http://localhost:9090/api/v1/transaction/";
const TRANASACTION_API_FILTER_URL = "http://localhost:9090/api/v1/filter/";
const TRANASACTION_API_UPDATE_URL = "http://localhost:9090/api/v1/transaction/update/";

class TransactionService{
    getAllTransactions(){
        const token = localStorage.getItem('jwtToken');
        return axios.get(TRANASACTION_API_BASE_URL, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getAllTransactionById(uid){
        const token = localStorage.getItem('jwtToken');
        return axios.get(TRANASACTION_API_SET_URL+uid,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getFilter(start,finish){
        let param = "?start="+start+"&finish="+finish;
        const token = localStorage.getItem('jwtToken');
        return axios.get(TRANASACTION_API_FILTER_URL+param,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getFilterUid(start,finish,uid){
        let param = "?start="+start+"&finish="+finish+"&uid="+uid;
        const token = localStorage.getItem('jwtToken');
        return axios.get(TRANASACTION_API_FILTER_URL+param,{
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
        axios.post(TRANASACTION_API_SET_URL, credentials, {
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
        axios.post(TRANASACTION_API_UPDATE_URL, credentials, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }
}

export default new TransactionService()