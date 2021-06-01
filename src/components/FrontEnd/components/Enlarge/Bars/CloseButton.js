import React from 'react'

const CloseButton = (props) => {
    return(
        <div 
        className={"enlarge-closeButton-container"}
        >
            <button 
            className="enlarge-closeButton-button"
            onClick={(e) => {
                e.stopPropagation()
                props.context.closeEnlarge()
            }}
            >
                <span>close</span>
                    {/* <img className={"List-closeButton_img"} src="icons/svg/view-left.svg" alt="close icon"/> */}
            </button>
        </div>
    )
}

export default CloseButton