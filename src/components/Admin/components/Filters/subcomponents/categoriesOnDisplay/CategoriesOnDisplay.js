import React from 'react';

const CategoriesOnDisplay = (props) => {
    const isChecked = (displayTrigger, value) => {
        if(props.context.state.categoriesOnDisplay[displayTrigger][value]){
            return props.context.state.categoriesOnDisplay[displayTrigger][value].display
        }
        else{return false}
    }

    const makeCategories = () => {
        
        let result = props.context.state.categoriesData.map(obj => {

            let subcategories = null;

            if(obj.subcategory){
                let allSubcategories = Object.keys(obj.subcategory)
                subcategories = allSubcategories
                .map(subcategory => {
    
                    let listItems = obj.subcategory[subcategory].map((listitem, index) => {
                        return (
                            <li key={`${listitem}${index}}`} 
                            className={
                            `list--listitem list-group-item themes-list
                            ${props.context.categoryMethods.autoCheckCategories(props.fileName, obj.category, subcategory, listitem) ? "themes-list--selected" : ""}`}>
                                <div 
                                    className={`themes-list displayCategory-title ${isChecked("listitems", listitem) ? "themes-list--selected themes-list" : ""}`}>                       
                                    <div className={"displayCategory-checkbox"}>
                                        <label htmlFor={`filters-${obj.category}-${subcategory}-${listitem}-displayCategory`}>{listitem}</label>
                                        <input 
                                            id={`filters-${obj.category}-${subcategory}-${listitem}-displayCategory`}
                                            className="navigation-input subcategory" 
                                            type="checkbox" 
                                            value={listitem} 
                                            onChange={(e) => props.context.categoryMethods.displayCategory("listitems", listitem)} 
                                            checked={isChecked("listitems", listitem)}
                                        /> 
                                    </div>
                                    <div className={"displayCategory-altName"}>
                                        <label 
                                            htmlFor={`filters-${obj.category}-${subcategory}-${listitem}-displayCategory-altName`}
                                            onClick={() => {
                                                document.getElementById(`filters-${obj.category}-${subcategory}-${listitem}-displayCategory-altName`).classList.toggle("display-no")
                                            }}
                                        >
                                            Display Name:
                                        </label>
                                        <input 
                                            id={`filters-${obj.category}-${subcategory}-${listitem}-displayCategory-altName`}
                                            className="navigation-input subcategory display-no" 
                                            type="text"
                                            value={props.context.state.categoriesOnDisplay.listitems[listitem] ? 
                                                props.context.state.categoriesOnDisplay.listitems[listitem].altName
                                                : listitem
                                            }
                                            onChange={(e) => {
                                                props.context.categoryMethods.displayCategoryAltName("listitems", listitem, e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                            </li>
                        )
                    })
                    
                    return(
                    <ul key={subcategory} id={subcategory} className="list--subcategory list-group list-group-item">
                        <div 
                            className={`themes-list displayCategory-title ${isChecked("subcategory", subcategory) ? "themes-list--selected themes-list" : ""}`}>                       
                            <div className={"displayCategory-checkbox"}>
                                <label htmlFor={`filters-${obj.category}-${subcategory}-displayCategory`}>{subcategory}</label>
                                <input 
                                    id={`filters-${obj.category}-${subcategory}-displayCategory`}
                                    className="navigation-input subcategory" 
                                    type="checkbox" 
                                    value={subcategory} 
                                    onChange={(e) => props.context.categoryMethods.displayCategory("subcategory", subcategory)} 
                                    checked={isChecked("subcategory", subcategory)}
                                /> 
                            </div>
                            <div className={"displayCategory-altName"}>
                                <label 
                                    htmlFor={`filters-${obj.category}-${subcategory}-displayCategory-altName`}
                                    onClick={() => {
                                        document.getElementById(`filters-${obj.category}-${subcategory}-displayCategory-altName`).classList.toggle("display-no")
                                    }}
                                >
                                    Display Name:
                                </label>
                                <input 
                                    id={`filters-${obj.category}-${subcategory}-displayCategory-altName`}
                                    className="navigation-input subcategory display-no" 
                                    type="text"
                                    value={props.context.state.categoriesOnDisplay.subcategory[subcategory] ? 
                                        props.context.state.categoriesOnDisplay.subcategory[subcategory].altName
                                        : subcategory
                                    }
                                    onChange={(e) => {
                                        props.context.categoryMethods.displayCategoryAltName("subcategory", subcategory, e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        {listItems}
                     </ul>)
                })
            }
            return (
            <div key={obj.category} className="list-group list-group-category">
                <ul id={obj.category} className="list--category"> 
                    <div 
                        className={`themes-list displayCategory-title ${isChecked("category", obj.category) ? "themes-list--selected themes-list" : ""}`}>                       
                        <div className={"displayCategory-checkbox"}>
                            <label htmlFor={`filters-${obj.category}-displayCategory`}>{obj.category}</label>
                            <input 
                                id={`filters-${obj.category}-displayCategory`}
                                className="navigation-input category" 
                                type="checkbox" 
                                value={obj.category} 
                                onChange={(e) => props.context.categoryMethods.displayCategory("category", obj.category)} 
                                checked={isChecked("category", obj.category)}
                            /> 
                        </div>
                        <div className={"displayCategory-altName"}>
                            <label 
                                htmlFor={`filters-${obj.category}-displayCategory-altName`}
                                onClick={() => {
                                    document.getElementById(`filters-${obj.category}-displayCategory-altName`).classList.toggle("display-no")
                                }}
                            >
                                Display Name:
                            </label>
                            <input 
                                id={`filters-${obj.category}-displayCategory-altName`}
                                className="navigation-input category display-no" 
                                type="text"
                                value={props.context.state.categoriesOnDisplay.category[obj.category] ? 
                                    props.context.state.categoriesOnDisplay.category[obj.category].altName
                                    : obj.category
                                }
                                onChange={(e) => {
                                    props.context.categoryMethods.displayCategoryAltName("category", obj.category, e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    {subcategories}
                </ul>
            </div>
            )
        })

        return result
    }

    return(
        <div className="list--container">
            {makeCategories()}
        </div>
        )
  }

  export default CategoriesOnDisplay
