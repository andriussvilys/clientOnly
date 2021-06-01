import React from 'react'
import DropDownList from '../../DropDownList'

const Themes = (props) => {
    return(
        <DropDownList 
        title={"Select Family Themes"}
        context={props.context}
        state={props.context.state}
        array={props.dataArray}
        onChange={props.onChange}
        isChecked={props.isChecked}
        checkbox
        fileName={props.fileName}
        string={"themes"}
        id="Themes-list"
        
        router={'/api/themes/update'}
        addNewTarget={'themesData'}
        addNew={props.addNew}
        addNewTitle="Add new Theme"
        requestKey={"list"}

        allowDelete={props.allowDelete}
        modalInvoke={props.modalInvoke}
        />
    )
}

export default Themes 