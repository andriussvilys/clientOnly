import React, { Fragment } from 'react'
import Filters from '../Filters/Filters'
import EditFamilyInfo from '../FamilyInfo/EditFamilyInfo'

const GlobalSetup = (props) => {
    return(
        <Fragment>
            <EditFamilyInfo 
                context={props.context}
                addNew={props.addNew}
            />
            <Filters 
                context={props.context}
            />
            {props.children}
        </Fragment>
    )
}

export default GlobalSetup