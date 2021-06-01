import React from 'react'
import PreviewCounter from './PreviewCounter'

const ViewControls = props => {
    if(!props.context.state.enlarge || !props.context.state.enlarge.open){
        return null
    }
    const disabled = props.context.state.enlarge && props.context.state.enlarge.familySequence ? props.context.state.enlarge.familySequence.familySequence.length < 2 : true
    return(
        <div className={"viewControls"}>
            {props.children}
            <div 
                className={"viewControls-info-container"}
            >
                <button
                    className={"viewControls-button viewControls-button-info"}
                    onClick={e => {e.stopPropagation(); props.showInfo(e, {close: props.infoUp ? false : true})}}
                >
                    <span>{props.showInfoText}</span>
                </button>
            </div>

        </div>
    )
}

export default ViewControls