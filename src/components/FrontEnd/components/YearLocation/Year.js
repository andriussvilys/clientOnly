import React, { Fragment } from 'react'
import Category from '../TagsMenu/Category'

const Year = (props) => {

    let years = props.years

    let yearList = years.map((year, index) => {
            return <li 
            key={`li-${year}-${index}`} 
            // style={{flex: "1 1 48%", listStyle: "none"}}
            className="tags-li"
            >
                <Category 
                key={year}
                category={year}
                level="year"
                onChange={() => props.context.filterByYear(year)}
                isChecked={props.context.yearChecked(year)}
                showContent={() => {return}}
                modifierClass={"year-tag"}
                />
            </li>
    })

        return(
            <Fragment>
                <ul className="tagsMenu-list tagsMenu-list-tags">{yearList}</ul>
            </Fragment>
        )
}

export default Year