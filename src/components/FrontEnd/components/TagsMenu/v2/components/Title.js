import React, { Fragment } from 'react'

const Title = (props) => {
    return(
        <Fragment>
            <label 
                className={`FilterTree-title`}
                htmlFor={`FilterTree-checkbox-${props.title}`}
                >
                {props.title}
            </label>
            <div 
                className="styledCheckbox-container"
            >
                <input 
                className={`styledCheckbox-checkbox`}
                id={`FilterTree-checkbox-${props.title}`} 
                type="checkbox" 
                checked={props.isChecked}
                onChange={props.onChange}
                ></input>
                <span 
                onClick={props.onChange}
                className="styleCheckbox-checkmark"
                ></span>
            </div>
        </Fragment>
    )
}
export default Title