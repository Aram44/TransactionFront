import axios from 'axios';

const BALANCE_INFO_URL = "http://localhost:9090/api/v1/account/report/balance";
const LOAN_INFO_URL = "http://localhost:9090/api/v1/loan/report";
const PAYMENTS_INFO_URL = "http://localhost:9090/api/v1/schedules/";

class ReportInfoService{
    getBalanceInfo(){
        const token = localStorage.getItem('jwtToken');
        return axios.get(BALANCE_INFO_URL, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    }
    getLoanInfo(){
      const token = localStorage.getItem('jwtToken');
      return axios.get(LOAN_INFO_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  }
    getPaymentsInfo(){
      const token = localStorage.getItem('jwtToken');
      return axios.get(PAYMENTS_INFO_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  }
}

export default new ReportInfoService()