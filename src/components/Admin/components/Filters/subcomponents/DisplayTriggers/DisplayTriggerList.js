import React from 'react'

const DisplayTriggerList = (props) => {

    const isChecked = (title, file, item) => {

        if(props.familySetup){

        }

        if(title === "category"){
            return file.displayTriggers ? file.displayTriggers[title].includes(item) : false
        }
        if(title === "subcategory"){
            return file.displayTriggers ? file.displayTriggers[title].includes(item) : false
        }
        if(title === "listitems"){
            return file.displayTriggers ? file.displayTriggers[title].includes(item) : false
        }
        if(title === "themes"){
            if(file.displayTriggers && file.displayTriggers[title])
            return file.displayTriggers ? file.displayTriggers[title].includes(item) : false
        }
    }


    
    const createList = (title, data, fileName, familySetup) => {
        if(!data){return}
        if(data.length <= 0){return}
        let list = data.map(item => {
            if(item === "" || item === " "){return null}
            return <li key={`trigger-${title}-${item}`} className={`themes-list ${isChecked(props.title, props.file, item) ? "themes-list--selected" : ""}`}>
                        <label htmlFor={`displayTriggers-${title}-${item}`}>{item}</label>
                        <input 
                            id={`displayTriggers-${title}-${item}`}
                            type="checkbox"
                            checked={isChecked(props.title, props.file, item)}
                            onChange={() => props.onChange(item, title, fileName, familySetup)}
                        />
                    </li>
        })
        return list
    }

    return(
        <div className="displayTrigger-wrapper">
            <p className="displayTrigger-title">{props.title}</p>
            <ul>
                {createList(props.title, props.data, props.file.fileName, props.familySetup)}
            </ul>
        </div>
    )
}

export default DisplayTriggerList