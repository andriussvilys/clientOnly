import React, { Fragment } from 'react';
import SelectFamily from '../FamilyInfo/subcomponents/SelectFamily'
import SeeAlso from './SeeAlso'

export default class SeeAlsoPicker extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            modalMessage: null,
            modalConfirm: true,
            fileList: this.props.context.state.artworkInfoData,
            allFiles: this.props.context.state.artworkInfoData,
            filteredFiles: {}
        }
    }

    onClose = () => {
        this.setState({showModal: false, modalConfirm: true})
    }

    verify = () => {
        const result = this.props.context.verify()
        if(result.verified){
          return true
        }
        else{
          this.setState({...result})
          return false
        }
      }
    PickSeeAlso = (fileName, parent, e) => {
        let selectedFiles = [...this.state.selectedFiles]
        if(e.target.value === "yes"){
            selectedFiles = [...selectedFiles, fileName]
        }
        else{
            selectedFiles = selectedFiles.filter(selectedFileName => selectedFileName !== fileName)
        }
        this.setState({selectedFiles})
        this.props.context.fileDataMethods.updateSeeAlso(fileName, parent)
    }
    EditDetail = (file) => {
        if(!file){return null}
        return <SeeAlso 
                    key={`seeAlso-${file.fileName}`}
                    file={file}
                    directory={this.props.directory}
                    onChange={this.PickSeeAlso}
                    parent={this.props.parent.fileName}
                />
    }

    filterByFamily = (value, string, fileName, checked ) => {
        let newRenderList = {...this.state.filteredFiles}
        const data = this.state.allFiles
        const list = Object.keys(this.state.allFiles)
        if(!checked){
          Object.keys(newRenderList).forEach(fileName => {
              if(newRenderList[fileName].artworkFamily === value){
                  delete newRenderList[fileName]
              }
          })
        }

        else{
            list.forEach(objName => {
                if(data[objName].artworkFamily === value){
                    const obj = data[objName]
                    newRenderList = {...newRenderList, [objName]: obj}
                }
            })
        }
        let orderedList = Object.keys(newRenderList)
        let newOrderedList = []
        orderedList.forEach(fileName => {
            if(this.state.selectedFiles.indexOf(fileName) >= 0){
                newOrderedList.unshift(fileName)
            }
            else{
                newOrderedList.push(fileName)
            }
        })
        let newState = {...this.state}
        newState.orderedList = newOrderedList
        newState.filteredFiles = newRenderList
        this.setState(newState)
    }

    reloadAll = (e) => {
        const allInputs = Array.from(e.target.parentNode.querySelectorAll("input"))
        allInputs.forEach(input => input.checked = false)
        let newState = {...this.state}
        const allFileNames = Object.keys(this.props.state.artworkInfoData)
        const selectedFiles = this.state.selectedFiles
        const withoutSelected = allFileNames.filter(fileName => !selectedFiles.includes(fileName))
        const orderedList = [...selectedFiles, ...withoutSelected]       
        newState.orderedList = orderedList
        newState.filteredFiles = []
        this.setState(newState)
    }

    componentDidMount(){
        if(!this.props.state){
            return null
        }
        const allFileNames = Object.keys(this.props.state.artworkInfoData)
        const selectedFiles = this.props.highlightRef
        const withoutSelected = allFileNames.filter(fileName => !selectedFiles.includes(fileName))
        const orderedList = [...selectedFiles, ...withoutSelected]
        const newState = {...this.state}
        newState.orderedList = orderedList
        newState.fileList = {}
        newState.allFiles = this.props.state.artworkInfoData
        newState.selectedFiles = this.props.highlightRef
        this.setState(newState)
    }

    render(){
        if(this.props.state && this.state.orderedList){
            return(
                    <div 
                    id={'familyContainer-seeAlso'}
                    className={"EditDetailContainer"}
                    >
                            <div className={`familyPicker ${this.state.open ? "" : "familyPicker_closed"}`}>
                                <div className="familyPicker-toggleContainer">
                                    <div 
                                        className="familyPicker-toggleContainer-icons"
                                        onClick={() => {
                                            this.setState({open: !this.state.open})
                                        }}    
                                    >
                                        {this.state.open ?                                     
                                            <img 
                                                alt="view next" 
                                                src="/icons/svg/view-right.svg" 
    
                                            /> : null
                                        }
                                        <img 
                                            alt="view next" 
                                            src="/icons/svg/filter.svg" 
                                        />
                                        {!this.state.open ?                                     
                                            <img 
                                                alt="view next" 
                                                src="/icons/svg/view-left.svg" 
                                            /> : null
                                        }
                                    </div>
                                </div>
                                {this.state.open ?     
                                    <Fragment>
                                        <SelectFamily 
                                            context={this.props.context}
                                            onChange={this.filterByFamily}
                                            uncontrolled
                                            containerModifier="grid-wrapper_filters"
                                        />
                                        <button
                                            className={"btn-sm btn-primary familyPicker-reload"}
                                            onClick={e => this.reloadAll(e)}
                                        >
                                            reload file list
                                        </button> 
                                    </Fragment>                       
                                    : null
                                }            
                            </div>
    
    
                        <div 
                        className={"grid-wrapper"}
                        >
                            {
                                this.state.orderedList.map(fileName => {
                                    return this.EditDetail(this.props.context.state.artworkInfoData[fileName])
                                })
                            }
                        </div>
                    </div>
            )
        }
        else{
            return null
        }

    }
}