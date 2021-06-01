import React from 'react';
import AddNew from './AddNew';

export default class DropDownList extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          category: {}
        }
      }

deletePromise = (string, theme) => {
    return new Promise((resolve, reject) => {
        if(string !== "themes"){
            reject()
        }
        else{
            console.log("initiate context.deleteTheme")
            this.props.context.deleteTheme(theme)
                .then(res => resolve())
                .catch(err => reject())
        }
    })
}      

/**
 *@param {array} array source data for list
 *@param {string} string used for ids/names 
 *@param {state} object main App state context or redux
 *@param {fileName} string targets a particular file record in state
 */
    createDropDownList = (array, string, state, fileName) => {
        let statePath = state.familySetupData

        if(fileName){
            statePath = state.fileData.files[fileName]
        }

        const highlighter = (string, listItem) => {
            if(this.props.uncontrolled){
                return
            }
            if(this.props.highlighted){
                let highlighted = null
                if(this.props.highlighted[string] && this.props.highlighted[string].includes(listItem)){
                    highlighted = true
                }
                else{
                    highlighted = false
                }
                if(highlighted){
                }
                return highlighted
            }

            if(string === "artworkFamily"){
            }
            if(!statePath[string]){
                return false
            }
            if(statePath[string]){
                if(typeof statePath[string] === 'string'){
                    return statePath[string] === listItem
                }
                else if( Array.isArray(statePath[string]) ){
                        return statePath[string].includes(listItem)
                    }
            }
            else return false
        }

        // array = array.map(item => item.toUpperCase())

        let lettersArray = []
        array.forEach(item => {
            if(!lettersArray.includes(item[0].toUpperCase())){
                lettersArray = [...lettersArray, item[0].toUpperCase()]
            }
        })

        let sortedByLetter = {}

        lettersArray.sort().forEach(letter => {
            if(Object.keys(lettersArray).includes(letter)){
                sortedByLetter[letter] = []
            }
            sortedByLetter[letter] = array.filter(item => {
                return item[0].toUpperCase() === letter.toUpperCase()
            })
        })
        let listItem = (listItem) => {
            return (
                <li 
                className={`themes-list ${highlighter(string, listItem) ? 'themes-list--selected' : null}`} 
                key={`${string}-${listItem}`}
                >

                        {this.props.allowDelete ?                         
                            <div
                                className={"themes-list-delete"}
                                key={`dropdown-${string}-delete-${listItem}`}
                                onClick={() => {
                                    this.props.modalInvoke({
                                        requireActionConfirm: true,
                                        confirmedAction: () => {
                                            return new Promise((resolve, reject) => {
                                                this.deletePromise(string, listItem)
                                                    .then(res => resolve({confirm: false, modalMessage: "Theme deleted."}))
                                                    .catch(err => reject({confirm: false, modalMessage: "Theme delete failed."}))
                                            })
                                        },
                                        modalMessage: <span>Delete <strong>{listItem}</strong> {string}?</span>
                                    }, 
                                    )
                                }}
                            >
                                <img alt="delete icon" src="/icons/close-round-line.png" />
                            </div> : 
                            null
                        }   

                    <label htmlFor={`${string}-${listItem}-${this.props.fileName || this.props.parent}`} className="themes-span">{listItem}</label>

                    {this.props.uncontrolled ?   
                        <input 
                            id={`${string}-${listItem}-${this.props.fileName || this.props.parent}`}
                            className="themes-checkbox" 
                            type={ !this.props.checkbox ? "radio" : "checkbox"}
                            value={listItem}
                            name={string}
                            onChange={(e) => {
                                console.log("event in dropdownlist")
                                console.log("checked")
                                console.log(e.target.checked)
                                this.props.onChange(e.target.value, string, fileName, e.target.checked)
                                return
                            }}
                        />

                        :

                        <input 
                            id={`${string}-${listItem}-${this.props.fileName || this.props.parent}`}
                            className="themes-checkbox" 
                            type={ !this.props.checkbox ? "radio" : "checkbox"}
                            value={listItem}
                            name={string}
                            checked={highlighter(string, listItem)}
                            onChange={(e) => {
                                this.props.onChange(e.target.value, string, fileName)
                                return
                            }}
                        />   
                    }

                </li>
            )
        }

        const listsByLetter = () => {
            let finalList = Object.keys(sortedByLetter).map(letter => {
                return <div 
                            key={`dropdown-${string}-${letter}`}
                            className="dropdown-container"
                        >
                        <p className="dropdown-headline">{letter.toUpperCase()}</p>
                        <ul>
                            {sortedByLetter[letter].sort().map(item => {
                            return listItem(item)
                            })}
                        </ul>
                       </div>
            })
            return finalList
        }

        return listsByLetter()
    }

    render(){
        return(
            <div className={`${this.props.containerModifier ? this.props.containerModifier : "grid-wrapper"}`}>
                {this.createDropDownList(this.props.array, this.props.string, this.props.state, this.props.fileName)}
                <AddNew 
                    addNew={this.props.addNew}
                    addNewTitle={this.props.addNewTitle}
                    router={this.props.router}
                    stateKey={this.props.addNewTarget}
                    requestKey={this.props.requestKey}
                />
            </div>
        )
    }
}