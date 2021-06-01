import React from 'react';

import ImageBox from '../ImageBox/ImageBox';
import SelectFamily from '../FamilyInfo/subcomponents/SelectFamily'
import Accordion from '../Accordion';

export default class FileUpdate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            modalMessage: null,
            modalConfirm: true,
            fileList: this.props.context.state.artworkInfoData,
            allFiles: this.props.context.state.artworkInfoData
        }
    }

    EditDetail = (file) => {
        if(!file){return}
        return(
                <ImageBox
                    file={file}
                    key={`${file.fileName}-detail`}
                >
                    {this.props.children}
                </ImageBox>
        )
    }

    filterByFamily = (value) => {
        let newRenderList = {}
        const data = this.state.allFiles
        const list = Object.keys(this.state.allFiles)
        list.forEach(objName => {
            if(data[objName].artworkFamily === value){
                const obj = data[objName]
                newRenderList = {...newRenderList, [objName]: obj}
            }
        })
        this.setState({fileList: newRenderList}, () => {console.log('filter done'); console.log(this.state)})
    }

    reloadAll = () => {
        this.setState({fileList: this.state.allFiles})
    }

    deletePromise = (fileName, artworkFamily) => {
        return new Promise((resolve, reject) => {
            this.props.context.fileDataMethods.deleteDBrecord(fileName, artworkFamily)
                .then(res => {resolve({
                        modalMessage: res,
                        modalConfirm: false
                    })
                })
                .catch(err => {reject({
                        modalMessage: err,
                        modalConfirm: false
                    })
                })
        })
    }

    componentDidMount(){
        if(this.props.context.state){
            this.setState({fileList: this.props.context.state.artworkInfoData})
        }
    }

    render(){
        if(this.state.fileList){
            return(
                    <div 
                    id={'familyContainer'}
                    className={"EditDetailContainer"}
                    >
                        <div className="familyPicker">
                            <div className="familyPicker-toggleContainer">
                                <div className="familyPicker-toggleContainer-icons">
                                    <img 
                                        className={`viewControls-viewNext ${disabled ? "viewControls-button-disabled" : ''}`}
                                        alt="view next" 
                                        src="icons/svg/view-right.svg" 
                                    />
                                    <img 
                                        className={`viewControls-viewNext ${disabled ? "viewControls-button-disabled" : ''}`}
                                        alt="view next" 
                                        src="icons/svg/filters.svg" 
                                    />
                                </div>
                            </div>

                            <SelectFamily 
                                context={this.props.context}
                                onChange={this.filterByFamily}
                            />
                            <button
                                className={"btn-sm btn-primary familyPicker-reload"}
                                onClick={this.reloadAll}
                            >
                                reload file list
                            </button>
                        </div>
    
    
                        <div 
                        className={"grid-wrapper"}
                        >
                            {
                                Object.keys(this.state.fileList).map(fileName => {
                                    return this.EditDetail(this.props.context.state.artworkInfoData[fileName])
                                })
                            }
                        </div>
                    </div>
            )
        }
        else{
            return(
                <div>no load</div>
            )
        }
    }
}