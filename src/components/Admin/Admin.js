import React from 'react';
import Button from 'react-bootstrap/Button'
import { Provider } from '../Provider';
import { BrowserRouter,  Link } from 'react-router-dom';
import Create from './Create';
import Edit from './Edit'
import Delete from './Delete'
import {PrivateRoute} from '../PrivateRoute'

import auth from '../Auth'

import '../../css/main.css'

export default class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }
    render(){
        return(    
            <BrowserRouter>
                <Provider>
                    <div className="admin-container">
    
                        <nav className={"admin-nav"}>
                            <div className={"admin-level"}>{!auth.guest ? "ADMIN" : "Guest"}</div>
                            <ul className={"admin-nav-list"}>
                                <li>
                                    <Link to="/admin/create">
                                        <Button>
                                            Create 
                                        </Button>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/edit">
                                        <Button>
                                            Edit
                                        </Button>
                                    </Link>
                                </li>
                                {!auth.guest ? <li>
                                            <Link to="/admin/delete">
                                                <Button disabled variant="danger">
                                                    Delete 
                                                </Button>
                                            </Link>
                                        </li> :
                                        null
                                }
                                <li>
                                    <Button 
                                        variant="success"
                                        onClick={() => {
                                            this.props.history.push('/')
                                        }}
                                    >
                                        Home
                                    </Button>
                                </li>
                                <li>
                                <Button
                                    onClick={() => {
                                        auth.logout( () => {
                                            this.props.history.push('/admin/login')
                                        })
                                    }}
                                >
                                    Log OUT
                                </Button>
                                </li>
                            </ul>
                        </nav>
                        <div className="admin-content">                            
                            <PrivateRoute path="/admin/create" component={Create} guest={auth.guest}/>
                            <PrivateRoute path="/admin/edit" component={Edit} guest={auth.guest}/>
                            <PrivateRoute path="/admin/delete" component={Delete} guest={auth.guest} />
                        </div>
                    </div>
                </Provider>
            </BrowserRouter>
          )
    }
}
