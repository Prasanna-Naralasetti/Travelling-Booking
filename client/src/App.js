import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>

        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
