import './App.css';
import HomeComponent from './components/HomeComponent';
import LoginComponent from './components/LoginComponent';
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import ChangePassComponent from './components/ChangePassComponent';

function App() {
  return (
    <div>
      <Router>
        <Switch>
            <Route exact path="/login"component={LoginComponent}/>
            <Route exact path="/verify"component={ChangePassComponent}/>
            <Route exact path="/" component={HomeComponent}/>
            <Route exact path="/changepass" component={ChangePassComponent}/>
        </Switch>
    </Router>
    </div>
  );
}

export default withRouter(App);
