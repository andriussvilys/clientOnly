import React, { Fragment } from 'react'
import Category from '../TagsMenu/Category'

const Location = (props) => {

    let locations = props.locations

    let locationList = locations.map((loc, index) => {
        return <li 
                key={`li-${loc}-${index}`} 
                style={{flex: "1 1 100%", listStyle: "none"}}
                >
                    <Category 
                        key={loc}
                        category={loc}
                        level="location"
                        onChange={() => props.context.filterByLocation(loc)}
                        isChecked={props.context.locationChecked(loc)}
                        showContent={() => {return}}
                        modifierClass={"location-tag"}
                    />
                </li>

        // return <li key={`location-${loc}`}>{loc}</li>
    })

        return(
            <Fragment>
                <ul  className="tagsMenu-list tagsMenu-list-tags">
                    {locationList}
                </ul>
            </Fragment>
        )
}

export default Location