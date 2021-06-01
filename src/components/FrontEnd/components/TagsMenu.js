import React, { Fragment } from 'react'
import Year from './YearLocation/Year';
import Location from './YearLocation/Location';
import Themes from './Themes/Themes';
import ClearAll from './ClearAll';
import About from './About/About';
import Category from './TagsMenu/Category';

import '../../../css/frontEndMain.css'

export default class TagsMenu extends React.Component{
    constructor(props){
        super(props)
        this.state = {subcategory: null, listItems: null}
    }
    /**
     * @param title: takes a string and spreads it into separate divs
     */
    spreadLetters = (title) => {
        let letters = Array.from(title).map((letter, index) => {
            return <div 
            key={`${title}-leter-${index}`} 
            className="title-letter"
            >{letter}</div>
        })
        return letters
    }
    onCategoriesClick = (category) => {
        let delay = 0
        //if closing category
        if(document.getElementById(`${category}-subcategories`).classList.contains("scroll-down")){
            //if listitem is open
            if(Array.from(document.getElementsByClassName("scroll-down-listitem")).length > 0){
                Array.from(document.getElementsByClassName("scroll-down-listitem")).forEach(item => item.classList.remove("scroll-down-listitem"))
                delay = 150
            }

            setTimeout(() => {
                Array.from(document.getElementsByClassName("scroll-down")).forEach(item => item.classList.remove("scroll-down"))
            }, delay);
            return
        }
        
        //if opening category
        else{
            if(Array.from(document.getElementsByClassName("TagsMenu-listitem")).length > 0){
                Array.from(document.getElementsByClassName("TagsMenu-listitem")).forEach(item => item.classList.remove("scroll-down-listitem"))
                delay = 150
            }

            if(document.getElementsByClassName("scroll-down").length > 0){
                setTimeout(() => {                    
                    document.getElementById("TagsMenu-subcategory-container").childNodes.forEach(child => {
                        child.classList.remove("scroll-down")
                    })
                }, delay);
                delay += 150
            }

            setTimeout(() => {
                document.getElementById(`${category}-subcategories`).classList.toggle("scroll-down")
            }, delay);
        }
    }
    onSubcategoriesClick = (subcategory) => {
        if(document.getElementById(`${subcategory}-listitem`) && document.getElementById(`${subcategory}-listitem`).classList.contains("scroll-down")){
            Array.from(document.getElementsByClassName("scroll-down-listitem")).forEach(item => item.classList.remove("scroll-down-listitem"))
            return
        }
        Array.from(document.getElementsByClassName("TagsMenu-listitem")).forEach(item => item.classList.remove("scroll-down-listitem"))
        if(document.getElementById(`${subcategory}-listitem`))
        document.getElementById(`${subcategory}-listitem`).classList.toggle("scroll-down-listitem")
    }
    createCategories = (data) => {

        let buttons = data.map(obj => {
            return <Category 
            key={`TagsMenu-category-${obj.category}`}
            clickable
            category={obj.category}
            level="category"
            context={this.props.context}
            onChange={() => this.props.context.filterByCategory(obj.category)}
            isChecked={this.props.context.categoryChecked(obj.category)}
            showContent={this.onCategoriesClick}
            />
        })

        return buttons
    }
    /**
     * return a div with listitems for a subcategory
     */
    createListItems = (listItemArray, subcategory, category) => {
        let listItems = listItemArray.map(listitem => {
            return <Category 
                            key={`button-${listitem}`}
                            clickable={false}
                            category={listitem}
                            level="listitem"
                            onChange={() => this.props.context.filterByListitem(category, subcategory, listitem)}
                            isChecked={this.props.context.listitemChecked(category, subcategory, listitem)}
                            showContent={() => {return}}
                    />
        })
        return <div key={`tagsMenu-listItems-${subcategory}`} className="button-wrapper TagsMenu-listitem" id={`${subcategory}-listitem`}>
                    {/* <div className="shadow"></div> */}
                    {listItems}
                </div>
    }
    listitemsContainer = []
    createSubcategories = (data) => {
        let subCatBlocks = []
        let listItems = []

        //obj === category
        data.forEach(obj => {
            const subcategories = Object.keys(obj.subcategory)
            
            let subContainer = subcategories.map(subcategory => {
                    if(obj.subcategory[subcategory].length > 0){
                        this.listitemsContainer = [...this.listitemsContainer, this.createListItems(obj.subcategory[subcategory], subcategory, obj.category)]
                    }
                    let button = <Category 
                    key={`button-${subcategory}`}
                    clickable={obj.subcategory[subcategory].length > 0}
                    category={subcategory}
                    level="subcategory"
                    context={this.props.context}
                    onChange={() => this.props.context.filterBySubcategory(obj.category, subcategory)}
                    isChecked={this.props.context.subcategoryChecked(obj.category, subcategory)}
                    showContent={this.onSubcategoriesClick}
                    />

                        if(obj.subcategory[subcategory].length > 0){
                            listItems = [...listItems, 
                                this.createListItems(obj.subcategory[subcategory], subcategory, obj.category) 
                            ]
                        }
                        
                    return button
                
            })


            // subContainer = [...subContainer, this.createListItems(obj.subcategory[subcategory], subcategory, obj.category)]
        subCatBlocks = [...subCatBlocks, 
            <Fragment key={`subcategories-${obj.category}`}>
                <div className="TagsMenu-subcategories" id={`${obj.category}-subcategories`}>
                    <div data-title="subcategories" className="button-wrapper subcategories">
                        {subContainer}
                    </div>
                    <div data-title="list" className="TagsMenu-listitems-container">
                        {listItems}
                    </div>
                </div>
            </Fragment>
    ]
        })
        subCatBlocks = [...subCatBlocks, 
            <div key={`TagsMenu-themes`} className="TagsMenu-subcategories subcategories button-wrapper" id="themes-subcategories">
                <Themes
                    state={this.props.context.state}
                    context={this.props.context}
                />
            </div>,
            <div key={`TagsMenu-yearLocation`} className="TagsMenu-subcategories" id="year/location-subcategories">
                <div data-title="subcategories" className="button-wrapper subcategories">
                    <Category 
                        clickable
                        category="year"
                        level="subcategory"
                        context={this.props.context}
                        button
                        showContent={this.onSubcategoriesClick}
                    />
                    <Category 
                        clickable
                        category="location"
                        context={this.props.context}
                        level="subcategory"
                        button
                        showContent={this.onSubcategoriesClick}
                    />
                </div>
                    <div data-title="list" className="TagsMenu-listitems-container">
                        <div className="button-wrapper TagsMenu-listitem" id={`year-listitem`}>
                            <Year 
                                years={this.props.context.state.yearLocation.years}
                                filterByYear={this.props.context.filterByYear}
                                yearChecked={this.props.context.yearChecked}
                                context={this.props.context}
                                modifierClass={"halfSize"}
                            />
                        </div>
                        <div className="button-wrapper TagsMenu-listitem" id={`location-listitem`}>
                            <Location 
                                locations={this.props.context.state.yearLocation.locations}
                                filterByYear={this.props.context.filterByYear}
                                context={this.props.context}
                            />
                        </div>
                    </div>
            </div>,
            <div key={`TagsMenu-contact`} className="TagsMenu-subcategories" id="contact-subcategories">
                <a className="title-letter contact-title" href="mailto:andriussvilys@gmail.com">andriussvilys@gmail.com</a>
                <a className="title-letter contact-title" href="https://www.instagram.com/istmblr/" rel="noopener noreferrer" target="_blank">instagram</a>
            </div>
        ]
        this.listitemsContainer = [...this.listitemsContainer, 
            <div className="button-wrapper TagsMenu-listitem" id={`year-listitem`}>
                <Year 
                    years={this.props.context.state.yearLocation.years}
                    filterByYear={this.props.context.filterByYear}
                    yearChecked={this.props.context.yearChecked}
                />
            </div>,
            <div className="button-wrapper TagsMenu-listitem" id={`location-listitem`}>
                <Location 
                    locations={this.props.context.state.yearLocation.locations}
                    filterByYear={this.props.context.filterByYear}
                />
            </div>,
        ]
        return subCatBlocks
    }
    render(){
        return <div
        id="TagsMenu"
        className={
            `TagsMenu-collapsed
            ${
                !this.props.context.state.mobile ? 
                    `TagsMenu-container` :
                    this.props.context.state.enlarge && this.props.context.state.enlarge.open ?
                    `TagsMenu-container TagsMenu-max` : 
                `TagsMenu-container`
            }
            `
        }
        >
            <div className="TagsMenu-wrapper">
                <div className="button-wrapper TagsMenu-about-contact">
                    <Category 
                        clickable
                        category="contact"
                        context={this.props.context}
                        level="category"
                        button
                        showContent={this.onCategoriesClick}
                    />
                    <About
                        loadEnlarge={this.props.context.loadEnlarge}
                    />
                    {this.props.children}
                </div>
                <Fragment>
                        <div className="TagsMenu-category-button-container">
                            {this.props.context.state.categoriesData ? this.createCategories(this.props.context.state.categoriesData) : null}
                            
                            <Category 
                                clickable
                                category="year/location"
                                level="category"
                                context={this.props.context}
                                button
                                showContent={this.onCategoriesClick}
                            />
                            <Category 
                                clickable
                                category="themes"
                                context={this.props.context}
                                level="category"
                                button
                                showContent={this.onCategoriesClick}
                            />
                            <ClearAll 
                                context={this.props.context}
                                enlarge={this.props.context.state.enlarge}
                            />
                        </div>
                        <div id="TagsMenu-subcategory-container" className="TagsMenu-subcategory-container">
                            {this.props.context.state.categoriesData ? this.createSubcategories(this.props.context.state.categoriesData) : null}
                        </div>
                        {/* <div id="TagsMenu-listitems-container" className="TagsMenu-listitems-container">
                            {this.listitemsContainer}
                        </div> */}
                </Fragment>
            </div>


        </div>
    }
}