import React from 'react'
import FamilyDescription from './subcomponents/FamilyDescription'
import SelectFamily from './subcomponents/SelectFamily'
import Accordion from '../Accordion'

const EditFamilyInfo = (props) => {
    return(
        <div className="themeSelector">
            <Accordion title="Select Artwork Family">
                <SelectFamily 
                    context={props.context}
                    addNew={props.addNew}
                    parent={"EditFamilyInfo"}
                    fileName={props.fileName}
                    uncontrolled={props.unconctrolled}
                    radio
                />
            </Accordion>
            <FamilyDescription 
                context={props.context}
                fileName={props.fileName}
            />
        </div>
    )
}

export default EditFamilyInfo