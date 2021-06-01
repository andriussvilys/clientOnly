import React from 'react';
import Checkbox from './Checkbox';

const Category = (props) => {

    const spreadLetters = (title, level) => {
        let letters = Array.from(title).map((letter, index) => {
            return <div key={`${title}-leter-${index}`} className={`title-letter ${level}-title-letter`}>{letter}</div>
        })
        return letters
    }

    return(
        <div
        key={`TagsMenu-category-${props.category}`} 
        className={props.isChecked ? 
            `TagsMenu-Accordion-label checkbox-selected` : `TagsMenu-Accordion-label`}
        onClick={props.onChange}
        >   
            <div 
            onClick={() => {props.showContent(props.category);}}
            className={`TagsMenu-category-title ${props.clickable ? "" : "no-click"} ${props.titleModifier ? props.titleModifier : ""}`} >
                {spreadLetters(props.category, props.level)}
            </div>
            {!props.button ? 
                <Checkbox
                    id={`${props.level}-${props.category}`}
                    onChange={props.onChange} 
                    isChecked={props.isChecked}
                    className={props.level === "category" ? "styledCheckbox-container_large" : "styledCheckbox-container_small"}
                />
                : null
            }
        </div>
    )
}

export default Category