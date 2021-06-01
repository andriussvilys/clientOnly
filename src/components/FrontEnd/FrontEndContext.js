import React, { Fragment } from 'react';
import { Provider } from './FrontEndProvider';

import FrontEndIndex from './FrontEndIndex'

export default class FrontEndContext extends React.Component{
    render(){
        const props = {...this.props}
        return(    
            <Provider>
                <Fragment>
                    <FrontEndIndex props={props}/>
                </Fragment>
            </Provider>
        )
    }
}