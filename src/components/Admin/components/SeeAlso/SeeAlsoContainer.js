import React, { Fragment } from 'react'
import { Button } from 'react-bootstrap';

import SeeAlso from './SeeAlso'
import SelectFamily from '../FamilyInfo/subcomponents/SelectFamily'
import Accordion from '../Accordion'

export default class SeeAlsoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            highlighted: {artworkFamily: []},
            fileList: this.props.initialData,
            allFiles: this.props.initialData
        }
    }

    renderContainer = (data) => {
        const fileNames = Object.keys(data).filter(fileName => fileName !== this.props.parent.fileName)
        const list = fileNames.map(fileName => {
            return <SeeAlso 
                        key={`seeAlso-${fileName}`}
                        file={data[fileName]}
                        directory={this.props.directory}
                        onChange={this.props.context.fileDataMethods.updateSeeAlso}
                        parent={this.props.parent.fileName}
                        // onChange={this.props.context.onChange}
                    />
        })
    return <div className="admin-seeAlso-container grid-wrapper">{list}</div>
    }

    filterByFamily = (value, checked, string) => {
        console.log("filter family runs")
        let newState = {...this.state}

            //REMOVE
        if(!checked){
            const data = this.state.fileList
            const list = Object.keys(this.state.fileList)
            let newList = {}
            let newHighlighted = []
            list.forEach(objName => {
                const currentObj = data[objName]
                if(currentObj.artworkFamily !== value){
                    newList = {...newList, [objName]: currentObj}
                    // newHighlighted = [...newHighlighted, objName]
                }
            })
            newState.fileList = newList
            // newState.highlighted[string] = newHighlighted
            newHighlighted = list.filter(fileName => {
                return data[fileName].artworkFamily !== value
            })
            console.log("newState.highlighted[string]")
            console.log(newHighlighted)
            return this.setState(newState)
            // return this.setState({fileList: newList, highlighted: {...this.state.highlighted,
            //     [string]: newHighlighted
            // }})
        }

            //ADD
        else{
            let newList = {...this.state.fileList}
            if(Object.keys(this.state.fileList).length === Object.keys(this.state.allFiles).length){
                newList = {}
            }
            const data = this.state.allFiles
            const list = Object.keys(this.state.allFiles)
            if(!newState.highlighted[string]){
                newState.highlighted[string] = []
            }
            let newHighlighted = newState.highlighted[string]
            list.forEach(objName => {
                if(data[objName].artworkFamily === value){
                    const obj = data[objName]
                    newList = {...newList, [objName]: obj}
                    newHighlighted = [...newHighlighted, objName]
                }
            })
            newState.fileList = newList
            newState.highlighted[string] = newHighlighted
            console.log(newState.highlighted)
            return this.setState(newState)
        }
    }

    reloadAll = () => {
        this.setState({fileList: this.state.allFiles})
    }


    componentDidMount(){
        this.setState({fileList: this.props.initialData, allFiles: this.props.initialData})
    }

    render(){
        return(
            <Fragment>
                <Accordion
                    title={"filter by family"}
                >
                    <SelectFamily 
                        context={this.props.context}
                        onChange={this.filterByFamily}
                        checkbox
                        // uncontrolled
                        highlighted={this.state.highlighted}
                    />
                    <Button 
                        onClick={() => {
                            this.reloadAll()
                        }}
                    >
                        reload all
                    </Button>
                </Accordion>

                {this.renderContainer(this.state.fileList)}

            </Fragment>
        )
    }
}
