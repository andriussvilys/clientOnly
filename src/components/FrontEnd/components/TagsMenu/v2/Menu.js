import React from 'react'
import FilterTree from './FilterTree'
import Category from '../Category'
import About from '../../About/About'
import ClearAll from '../../ClearAll'
import Themes from './Themes'
import YearLocation from './YearLocation'

const Menu = (props) => {
    return(
        <div className="FilterTree-container" id="TagsMenu">
            <div className="hamburger"
                onClick={(e) => props.context.showMenu(e)}
            ></div>
            <div className="FilterTree-container-buttons">
                <FilterTree 
                    categoriesData={props.context.state.categoriesData || []}
                    context={props.context}
                />
                {/* <div className="button-wrapper TagsMenu-about-contact">
                    <Category 
                        clickable
                        category="contact"
                        context={props.context}
                        level="category"
                    />
                    <About
                        loadEnlarge={props.context.loadEnlarge}
                    />
                </div> */}
                {/* <Category 
                    clickable
                    category="year/location"
                    level="category"
                    context={props.context}
                /> */}
                <YearLocation 
                    context={props.context}
                />
                <Themes
                    context={props.context}
                /> 
            </div>
        </div>
    )
}

export default Menu