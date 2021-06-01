import React, { Fragment } from 'react';
import { Sortable } from '@shopify/draggable';
import Button from 'react-bootstrap/Button';

import BootstrapModal from '../BootstrapModal';
import ImageBox from '../ImageBox/ImageBox';
import SelectFamily from '../FamilyInfo/subcomponents/SelectFamily'

export default class ArtworkOnDisplay extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            open: false,
            showModal: false,
            modalMessage: null,
            modalConfirm: true,
            // fileList: this.props.state.artworkInfoData,
            // allFiles: this.props.state.artworkInfoData
            fileList: null,
            allFiles: null
        }
    }

    selectImage = (file) => {
        const selected = this.state.selectedFiles.includes(file.fileName)
        let newState = {...this.state}
        let selectedFiles = []
        if(selected){
            selectedFiles = newState.selectedFiles.filter(fileName => fileName !== file.fileName)
        }
        else{
            selectedFiles = [...newState.selectedFiles, file.fileName]
        }
        newState.selectedFiles = selectedFiles
        this.setState(newState)
    }
    
    EditDetail = (file) => {
        if(!file){return}
        return(
                <ImageBox
                    file={file}
                    key={`${file.fileName}-detail`}
                    directory={this.state.selectedFiles}
                    // toggleShowInfo={true}
                    onImageClick={() => this.selectImage(file)}
                    hideInfo={true}
                    customClass={"ImageBox_artworkOnDisplay"}
                    draggable={true}
                >
                    <Button
                        onClick={() => {
                            const selected = this.state.selectedFiles.includes(file.fileName)
                            let newState = {...this.state}
                            let selectedFiles = []
                            if(selected){
                                selectedFiles = newState.selectedFiles.filter(fileName => fileName !== file.fileName)
                            }
                            else{
                                selectedFiles = [...newState.selectedFiles, file.fileName]
                            }
                            newState.selectedFiles = selectedFiles
                            this.setState(newState)
                        }}
                    >{this.state.selectedFiles.includes(file.fileName) ? "Unselect" : "Select"}</Button>
                </ImageBox>
        )
    }

    filterByFamily = (value) => {
        console.log("FILTER BY FAMILY ARTOWKRONDISPLAY")
        let newRenderList = {}
        const data = this.state.allFiles
        const list = Object.keys(this.state.allFiles)
        list.forEach(objName => {
            if(data[objName].artworkFamily === value){
                const obj = data[objName]
                newRenderList = {...newRenderList, [objName]: obj}
            }
        })
        const selectedFiles = this.props.highlightRef
        const newSelected = Object.keys(newRenderList).filter(fileName => selectedFiles.includes(fileName))
        const withoutSelected = Object.keys(newRenderList).filter(fileName => !selectedFiles.includes(fileName))
        const orderedList = [...newSelected, ...withoutSelected]
        console.log(newRenderList)
        // this.setState({fileList: newRenderList})
        this.setState({orderedList: orderedList})

    }

    reloadAll = (e) => {
        const allInputs = Array.from(e.target.parentNode.querySelectorAll("input"))
        let selectedInput = allInputs.find(input => input.checked)
        selectedInput.checked = false

        // this.setState({fileList: this.state.allFiles})
        // const allFileNames = Object.keys(this.props.state.artworkInfoData)
        // const selectedFiles = this.props.highlightRef
        // const withoutSelected = allFileNames.filter(fileName => !selectedFiles.includes(fileName))
        // const orderedList = [...selectedFiles, ...withoutSelected]        
        this.setState({orderedList: this.props.context.state.displayOrder.general})
    }

    componentDidMount(){

        const makeSwappable = () => {
            console.log("componenet did mount")
            const containerSelector = '#ArtworkOnDisplay';
            const containers = document.querySelectorAll(containerSelector);

            const sortable = new Sortable(containers, {
                delay:200,
                draggable: '.ImageBox_artworkOnDisplay',
                mirror: {
                  constrainDimensions: true,
                },
              });

            sortable.on('sortable:start', () => {});
            sortable.on('sortable:swapped', () => {});
            sortable.on('sortable:stop', () => {});

            return sortable
        }


        // const allFileNames = Object.keys(this.props.state.artworkInfoData)
        // const selectedFiles = this.props.highlightRef
        // const withoutSelected = allFileNames.filter(fileName => !selectedFiles.includes(fileName))
        // const orderedList = [...selectedFiles, ...withoutSelected]
        const newState = {...this.state}
        // newState.orderedList = orderedList
        newState.orderedList = this.props.context.state.displayOrder.general
        newState.fileList = this.props.state.artworkInfoData
        newState.allFiles = this.props.state.artworkInfoData
        newState.selectedFiles = this.props.highlightRef
        this.setState(newState, () => {
            makeSwappable()
        })
        // this.setState({fileList: this.props.state.artworkInfoData})
    }

    render(){
        if(this.state.orderedList){
            return(
                <Fragment>
                    <div 
                    id={'familyContainer'}
                    className={"EditDetailContainer EditDetailContainer-artworkOnDisplay"}
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
                                            // className={`viewControls-viewNext ${this.props.disabled ? "viewControls-button-disabled" : ''}`}
                                            alt="view next" 
                                            src="/icons/svg/view-right.svg" 

                                        /> : null
                                    }
                                    <img 
                                        // className={`viewControls-viewNext ${this.props.disabled ? "viewControls-button-disabled" : ''}`}
                                        alt="view next" 
                                        src="/icons/svg/filter.svg" 
                                    />
                                    {!this.state.open ?                                     
                                        <img 
                                            // className={`viewControls-viewNext ${this.props.disabled ? "viewControls-button-disabled" : ''}`}
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
                                        radio
                                        parent="artworkOnDisplay"
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
                      
                            <div className={"artworkOnDisplay-images"}>
                                <div>
                                    <Button
                                        onClick={() => {

                                            let artworkOnDisplay = {}
                                            this.state.selectedFiles.forEach(fileName => {
                                                artworkOnDisplay[fileName] = this.state.fileList[fileName]
                                            })
                                            const imgArray = Array.from(document.getElementById("ArtworkOnDisplay").querySelectorAll('.ImageBox_artworkOnDisplay img'))

                                            const imgOrder = imgArray.map(img => img.getAttribute("alt"))

                                            let newState = {...this.state}
                                            newState.displayOrder = {}
                                            newState.displayOrder.general = imgOrder
                                            console.log("newState SAVE ")
                                            console.log(newState)
                                            this.props.context.setArtworkOnDisplay({list:artworkOnDisplay, order: {...newState.displayOrder}})
                                            newState.showModal = true
                                            newState.modalMessage = "Saved"
                                            this.setState(newState)
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            this.setState({selectedFiles: []})
                                        }}
                                    >
                                        Unselect All
                                    </Button>
                                </div>

                                <div 
                                id={"ArtworkOnDisplay"}
                                className={"grid-wrapper"}
                                >
                                    {
                                        this.state.orderedList.map(fileName => {
                                        // this.props.context.state.displayOrder.general.map(fileName => {
                                            return this.EditDetail(this.props.state.artworkInfoData[fileName])
                                        })
                                    }
                                </div>
                            </div>
                        {this.state.showModal ?                     
                            <BootstrapModal 
                                showModal={this.state.showModal}
                                // onClose={this.onClose}
                                onClose={() => {this.setState({showModal:false})}}
                            >
                                {this.state.modalMessage}
                            </BootstrapModal> :
                            null
                        }
                    </div>
                </Fragment>
        )
        }
        else return null
    }
}