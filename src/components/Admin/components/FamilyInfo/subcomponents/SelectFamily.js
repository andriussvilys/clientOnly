import React from 'react'
import DropDownList from '../../DropDownList'

const SelectFamily = (props) => {
    return(
        <DropDownList 
            title={'Select Artwork Family'}
            parent={props.parent}
            state={props.context.state}
            array={props.context.state.artworkFamilyList}
            onChange={props.onChange || props.context.getFamilySetup}
            uncontrolled={props.uncontrolled}
            checkbox={!props.radio ? true : false}
            fileName={props.fileName}
            string={"artworkFamily"}
            id="List-of-artwork-families"
            highlighted={props.highlighted}
            containerModifier={props.containerModifier}

            router={'/api/familySetup/create'}
            addNewTarget={'artworkFamilyList'}
            addNew={props.addNew}
            addNewTitle="Add new Artwork Family name"
            requestKey={"artworkFamily"}
        />
    )
}

export default SelectFamily