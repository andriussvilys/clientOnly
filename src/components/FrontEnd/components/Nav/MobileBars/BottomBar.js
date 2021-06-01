import React from 'react'

const BottomBar = (props) => {
    return(
        <div
            className="mobileBar mobileBar-bottom"
            style={{
            }}
        >
            <div className="mobileBars-navButton_container">
                <button
                    className="mobileBar-navButton"
                    id="button-prev"
                    onClick={() => props.context.viewNext(-1)}
                >
                    <img alt="view previous" src="icons/svg/view-right.svg"/>
                </button>

                <button
                    className="mobileBar-navButton"
                    id="button-prev"
                    onClick={() => props.context.viewNext(-1)}
                >
                    <img alt="view previous" src="icons/svg/view-up.svg"/>
                </button>
                <button
                    className="mobileBar-navButton"
                    id="button-next"
                    onClick={() => props.context.viewNext(+1)}
                >
                    <img alt="view next" src="icons/svg/view-down.svg" />
                </button>

                <button
                    className="mobileBar-navButton"
                    id="button-next"
                    onClick={() => props.context.viewNext(+1)}
                >
                    <img alt="view next" src="icons/svg/view-left.svg" />
                </button>
            </div>
            <img 
            alt="info icon" 
            src="icons/svg/info.svg" 
            onClick={() => props.context.showInfo()}
            />
        </div>
    )
}

export default BottomBar