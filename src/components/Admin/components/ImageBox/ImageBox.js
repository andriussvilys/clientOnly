import React from 'react'
import FilePreview from '../FilePreview'

export default class ImageBox extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showInfo: null,
            toggleShowInfo: null
        }
        this.highlighter = (fileName) => {
            // console.log(`${fileName} IS SELECTED: ${this.props.directory.includes(fileName)}`)
            return this.props.directory ? this.props.directory.includes(fileName) : false
        }
    }
    componentDidMount(){
        this.setState({showInfo: !this.props.hideInfo, toggleShowInfo: this.props.toggleShowInfo})
    }
    render(){
        return(
            <div 
                className={`imageBox__wrapper ${this.props.customClass ? this.props.customClass : ""} ${this.highlighter(this.props.file.fileName)? 'themes-list--selected' : 'notSelected'}`}
                draggable={this.props.draggable}
                onClick={() => {
                    if(this.props.onImageClick){
                        this.props.onImageClick()
                    }
                }}
            >
            <FilePreview 
                file={this.props.file}
                onClick={e => {
                    if(this.state.toggleShowInfo){
                        this.setState({showInfo: !this.state.showInfo})
                    }
                    else{return}
                }}
            >
            </FilePreview>
            {this.state.showInfo ?             
                <div 
                    // className="imageBox__text display-no"
                    className={`imageBox__text`}
                >
                    <div className="imageBox__text__info">
                        <div className="">
                            <p className="title">File Name:</p> 
                            <p>{this.props.file.fileName}</p>
                        </div>
        
                        <div>
                            <p className="title">Artwork Family:</p> 
                            <p>{this.props.file.artworkFamily}</p>
                        </div>
                    </div>
                    {this.props.children}    
                </div> : null
            }
        </div>
        )
    }
}