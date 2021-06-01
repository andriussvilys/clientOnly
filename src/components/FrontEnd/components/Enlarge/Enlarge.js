import React from 'react'
import PinchToZoom from 'react-pinch-and-zoom'
import CloseButton from './Bars/CloseButton'
import ArtworkInfo from '../ArtworkInfo/ArtworkInfo'


export default class Enlarge extends React.Component{
    componentDidMount(){
    }
    render(){
        return(
                <div 
                    className={`enlargeContainer 
                    ${!this.props.context.state.mobile && this.props.context.state.showLess ? "full-width" : ""}
                    ${this.props.context.state.enlarge && this.props.context.state.enlarge.open ? "enlarge-scroll-left" : ""}
                    `}
                    id="enlargeContainer"
                >
                    {!this.props.context.state.enlarge || !this.props.context.state.enlarge.open ? null :                     
                        <CloseButton
                            context={this.props.context}
                        />
                    }
                    <PinchToZoom 
                        id="pinchContainer"
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

                        <div id="background" className="foreground-transition">
                            <img  alt={this.props.context.state.enlarge ? this.props.context.state.enlarge.fileName : "background"} id="background-img" src={"#"} className={`enlarge-preview`} />
                        </div>
                    </PinchToZoom>
                    <ArtworkInfo 
                        context={this.props.context}
                        mobile={this.props.mobile}
                        file={this.props.context.state.enlarge}
                        artworkInfoData={this.props.context.state.artworkInfoData}
                        info={this.props.context.state.info}
                    />
                </div>
        )
    }
    }