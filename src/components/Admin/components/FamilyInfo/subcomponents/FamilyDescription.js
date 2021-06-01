import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


const FamilyDescription = (props) => {
    const target = !props.fileName ?
    props.context.state.familySetupData :
    props.context.state.fileData.files[props.fileName]
    return(
        <div className="imageInfo--box familyDescription"  style={{display: "block"}}>
        <div>
            <p>Family description:</p> 
            <p className="subtitle">this description will appear on each item in the artwork family</p>
        </div>
        <textarea
            id="input_familyDescription"
            value={target.familyDescription || ""}
            onChange={
                (e) => {
                    const inputvalue = e.target.value
                    props.context.inputFamilyDescription(inputvalue)
                }
            }
            style={{width: "100%"}}
        ></textarea>
        {/* <div className="descriptionPreview--container"> */}
        <div>
            <p className="descriptionPreview--headline">Preview:</p>
            <p className="subtitle">(parsed HTML)</p>
            <div className="descriptionPreview--content descriptionPreview--container">
                {
                    target.familyDescription ? 
                        target.familyDescription ? <div>{ ReactHtmlParser(target.familyDescription)}</div> : ""
                    : ""
                }
            </div>
        </div>
    </div>
    )
}

export default FamilyDescription