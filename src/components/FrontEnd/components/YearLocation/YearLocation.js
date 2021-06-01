import React, { Fragment } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Category from '../TagsMenu/Category'

const YearLocation = (props) => {

    let years = props.yearLocation.years
    let locations = props.yearLocation.locations

    let yearList = years.map(year => {
    return <li key={`year-${year}`} className="tags-li">
            <div 
            className="tagsMenu-listItem"
            >
                <span>{year}</span>
                <input 
                    id={`year-${year}`}
                    type="checkbox" 
                    onChange={() => { props.filterByYear(year)}} 
                    // checked={props.context.themeChecked(theme)}
                />
            </div>
            </li>
    })

    let locationList = locations.map(loc => {
        return <li key={`location-${loc}`}>{loc}</li>
    })

        return(
            <Fragment>
                <Accordion
                >
                    <div>
                        <ul className="tagsMenu-list tagsMenu-list-tags">{yearList}</ul>
                    </div>
                </Accordion>
                <Accordion>
                    <div>
                        <ul>{locationList}</ul>
                    </div>
                </Accordion>
            </Fragment>
        )
}

export default YearLocation