import React, { Fragment } from 'react'
import PinchToZoom from 'react-pinch-and-zoom'
import CloseButton from './Bars/CloseButton'
import ArtworkInfo from '../ArtworkInfo/ArtworkInfo'
import {Carousel} from 'react-bootstrap'


export default class EnlargeAlt extends React.Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    // nextEnlarge={this.context.state.nextEnlarge}
    // file={this.context.state.enlarge}
    // onClick={this.context.closeEnlarge}
    // artworkInfoData={this.context.state.artworkInfoData}
    // loadEnlarge={this.context.loadEnlarge}
    // closeEnlarge={this.context.closeEnlarge}
    // hideArtworkInfo={this.context.hideArtworkInfo}
    // context={this.context}
    // mobile={this.context.state.mobile}
    renderFile = (fileSequence) => {
        // this.props.file.
        console.log("RENDER FILE")
        console.log(fileSequence)
        if(fileSequence){
            console.log("this.props.file.familySequence.familySequence")
            console.log(fileSequence)
            const carouselItems = fileSequence.map((fileName, index) => {
                console.log(fileName)
                return <Carousel.Item>
                        <PinchToZoom 
                            // id="pinchContainer"
                            className="pinchContainer"
                            panEvent={{
                                viewNext: this.props.context.viewNext, 
                                viewPrev: this.props.context.viewNext,
                                showMenu: this.props.context.showMenu,
                                showInfo: this.props.context.showInfo,
                                closeEnlarge: this.props.context.closeEnlarge
                            }}
                            state={this.props.context.state}
                            mobile={this.props.mobile}
                        >
                        <div 
                        // id="background" 
                        className="foreground-transition">
                                <img  
                                    alt={fileName | "background"} 
                                    // id="background-img" 
                                    src={this.props.context.state.artworkInfoData[fileName].desktopPath} 
                                    // src={"#"} 
                                    // src={"#"} 
                                    className={`enlarge-preview`} />
                            </div>
                        </PinchToZoom>
                    </Carousel.Item>
            })
            return carouselItems
        }
    }
    componentDidMount(){
    }
    render(){
        return(
            <Fragment>
                {!this.props.context.state.enlarge || !this.props.context.state.enlarge.open ? null :                     
                    <CloseButton
                        context={this.props.context}
                    />
                }
                <div className={"carousel-wrapper"}>
                    <Carousel slide={false}>
                        {this.renderFile(this.props.context.state.enlarge.familySequence.familySequence)}
                    </Carousel>
                </div>
            </Fragment>
        )
    }
    }