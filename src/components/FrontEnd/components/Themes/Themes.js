import React from 'react'
import Category from '../TagsMenu/Category'

const Themes = (props) => {

    const renderList = () => {
        
        const allThemes = Object.keys(props.state.themesOnDisplay).filter(theme => props.state.themesOnDisplay[theme].length > 0).sort()
        let renderList = allThemes.map(theme => {
            return <li key={theme} className="tags-li">
            <Category 
            key={theme}
            category={theme}
            level="theme"
            onChange={() => props.context.filterByTheme(theme)}
            isChecked={props.context.themeChecked(theme)}
            showContent={() => {return}}
            titleModifier={"nowrap"}
        />
            </li>
        })
        return <ul className="tagsMenu-list tagsMenu-list-tags">{renderList}</ul>
    }

    return(
        props.state.themesOnDisplay ? renderList() : null
    )
}

export default Themes