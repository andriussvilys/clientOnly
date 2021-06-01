import React from 'react'

const SelectGlobalSetup = (props) => {
    return(
        <div className="ImageInfo--transferState" style={{display: 'flex'}}>
            <p>use global family setup</p>

            <p className="subtitle"
            style={
                props.context.state.familySetupData.artworkFamily ? {transition: "all 0.2s", transform: "scaleY(0)"} : {transition: "all 0.2s", transform: "scaleY(1)"}
            }
            >
            please select global artwork family 
            </p>

            <form className="ImageInfo--transferState__radios">
                <div className="container-radio">
                    <input type="radio" 
                    name="familyDisplaySetup" 
                    id="familyDisplaySetup__radio-yes" 
                    value="yes" 
                    disabled={props.context.state.familySetupData.artworkFamily === null ? true : false}
                    onChange={() => {props.context.fileDataMethods.transferState(props.file, true)}}
                    checked={!props.context.state.fileData.files[props.file.fileName].useFamilySetup ? false : props.context.state.fileData.files[props.file.fileName].useFamilySetup}
                    />
                    <label 
                    htmlFor="familyDisplaySetup_yes"
                    id="familyDisplaySetup_yes"
                    >yes</label>
                </div>
                <div className="container-radio">
                    <input type="radio" 
                    name="familyDisplaySetup" 
                    id="familyDisplaySetup__radio-no" 
                    value="no" 
                    disabled={props.context.state.familySetupData.artworkFamily === null ? true : false}
                    onChange={() => props.context.fileDataMethods.transferState(props.file)}
                    checked={!props.context.state.fileData.files[props.file.fileName].useFamilySetup}
                    
                    />
                    <label htmlFor="familyDisplaySetup_no">no</label>
                </div>
            </form>
        </div>  
    )
}

export default SelectGlobalSetup