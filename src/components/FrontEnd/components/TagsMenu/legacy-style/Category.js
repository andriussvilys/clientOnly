import React from 'react'
import Selector from './Selector'

const Category = (props) => {
    const createCategory = data => {
        const subcategoryNames = Object.keys(data.subcategory)

        const subcategorySelectors = subcategoryNames.map(subcategoryName => {
            const isOnDisplay = (displayTrigger, value) => {
                if(props.context.state.categoriesOnDisplay[displayTrigger][value]){
                    return props.context.state.categoriesOnDisplay[displayTrigger][value].display
                }
                else{ return false}
            }
            const name = (displayTrigger, value) => {
                if(props.context.state.categoriesOnDisplay[displayTrigger][value]){
                    if(!props.context.state.categoriesOnDisplay[displayTrigger][value].altName){
                        return value
                    }
                    else return props.context.state.categoriesOnDisplay[displayTrigger][value].altName
                }
                else{ return value}
            }
            if(isOnDisplay("subcategory", subcategoryName)){
                const title =  <Selector 
                    key={`${data.category}-${subcategoryName}`}
                    title={`${name("subcategory", subcategoryName)}`}
                    id={`${data.category}-${subcategoryName}`}
                    onChange={(e) => props.context.filterBySubcategory(e, data.category, subcategoryName)}
                    isChecked={props.context.state.filters.onDisplay.subcategory.indexOf(subcategoryName) >= 0 ? true : false}
                />
                const getListItems = () => {
                    let listItems = []
                    data.subcategory[subcategoryName].forEach(listItem => {
                        if(isOnDisplay("listitems", listItem)){
                            return listItems = [...listItems, {title: listItem, subcategory: subcategoryName}]
                        }
                        })
                    return listItems
                }
                const listItemSelectors = getListItems().map(listItemObj => {
                    return <Selector 
                        key={`${data.category}-${listItemObj.subcategory}-${listItemObj.title}`}
                        title={`${name("listitems", listItemObj.title)}`}
                        customClass={"listItem"}
                        id={`${listItemObj.subcategory}-${listItemObj.title}`}
                        onChange={(e) => props.context.filterByListitem(e, data.category, listItemObj.subcategory, listItemObj.title)}
                        isChecked={props.context.state.filters.onDisplay.listitems.indexOf(listItemObj.title) >= 0 ? true : false}
                    />
                })
                return [title, ...listItemSelectors]
            }
            else{return null}
        })
        return (
            <ul className={"legacyStyle-List"}>
                <li className={"legacyStyle-List-categoryTitle"}>{data.category}:</li>
                {subcategorySelectors.map(selector => selector)}
            </ul>
        )
    }
    return(createCategory(props.data))
}

export default Category