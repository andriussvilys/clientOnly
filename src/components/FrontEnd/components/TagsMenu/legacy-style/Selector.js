import React from 'react'

const Selector = (props) => {
    return(
        <li className={`legacyStyle-List-listItem ${props.customClass ? props.customClass : ""}`}>
            <label 
                htmlFor={`FilterTree-checkbox-${props.id}`}
                >
                {props.title}
            </label>
                <input 
                id={`FilterTree-checkbox-${props.id}`} 
                type="checkbox" 
                checked={props.isChecked}
                onChange={props.onChange}
                ></input>
        </li>
    )
}
export default Selector