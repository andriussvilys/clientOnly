import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, } from 'react-router-dom';
import {PrivateRoute} from './components/PrivateRoute'

import FrontEndContext from './components/FrontEnd/FrontEndContext'

import Create from './components/Admin/Create';
import Admin from './components/Admin/Admin'
import Edit from './components/Admin/Edit'
import Delete from './components/Admin/Delete'
import Login from './components/Login'

import "bootstrap/dist/css/bootstrap.min.css";
// import './css/main.css';

export default class App extends Component{

  render(){
    return(
        <BrowserRouter>
              <div className="app-container" >

              <Switch>
                <Route  path="/" exact component={FrontEndContext} />
                <Route  path="/admin/login" exact component={Login} />
                <PrivateRoute  path="/admin"  component={Admin} />
                <PrivateRoute  path="/admin/create" component={Create} />
                <PrivateRoute  path="/admin/edit" component={Edit} />
                <PrivateRoute  path="/admin/delete" component={Delete} />
                <Route to="/*" exact component={FrontEndContext} />
              </Switch>

              </div>
        </BrowserRouter>
    )
  }
}