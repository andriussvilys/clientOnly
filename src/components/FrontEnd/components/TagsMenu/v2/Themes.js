import React, { Fragment } from 'react'
import Accordion from './components/Accordion'
import ClearAll from '../../ClearAll'

const Themes = (props) => {

const spreadLetters = (title) => {
    let letters = Array.from(title).map((letter, index) => {
        return <span 
        key={`${title}-leter-${index}`} 
        className="title-letter"
        >{letter}</span>
    })
    return letters
}

const createTheme = (options) => {
    return(
        <li 
        className={`tags-item list-item  ${options.isChecked ? "checkbox-selected" : ""}`}
        key={options.title} 
        onClick = {(e) => options.filter(e, options.title)}
        >
            {spreadLetters(options.title)}
        </li>
    )
}

const renderList = () => {
    if(!props.context.state.themesOnDisplay){
        return null
    }
    const allThemes = Object.keys(props.context.state.themesOnDisplay).filter(theme => props.context.state.themesOnDisplay[theme].length > 0).sort()
    let renderList = allThemes.map(theme => {
        return (
            createTheme({
                title: theme,
                filter: props.context.filterByTheme,
                isChecked: props.context.themeChecked(theme)
            })
        )
    })
    return <ul className="tagsMenu-list tagsMenu-list-tags" id="TagsMenu-themes_list">{renderList}</ul>
}

    return(
        <div
            className="FilterTree-wrapper"
            id="TagsMenu-themes_main"
        >
            <Accordion 
                containerClass={"FilterTree-form_category-title"}
                listId={"TagsMenu-themes_list"}
                mainContainer={"TagsMenu-themes_main"}
                collapse
            >
                {spreadLetters("Themes")}
            </Accordion>
            <div 
                className="FilterTree-list FilterTree-category FilterTree-container_main FilterTree-list_closed" 
                id="TagsMenu-themes_list"
            >
                <ClearAll 
                    context={props.context}
                    enlarge={props.context.state.enlarge}
                />
                {renderList()}
            </div>
        </div>
    )
}

export default Themes