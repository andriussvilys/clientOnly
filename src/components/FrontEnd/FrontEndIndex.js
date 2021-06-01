import React, {Fragment} from 'react'
import { Context } from './FrontEndProvider';

import TagsMenu from './components/TagsMenu'
import ImageSelect from './components/ImageSelect/ImageSelect'
import Carousel from './components/Enlarge/Carousel/Carousel'
import Enlarge from './components/Enlarge/Enlarge'
import EnlargeAlt from './components/Enlarge/EnlargeAlt'
import EnlargeKeenSlide from './components/Enlarge/EnlargeKeenSlide'
import ArtworkInfo from './components/ArtworkInfo/ArtworkInfo'

import MobileNav from './components/TagsMenu/legacy-style/MobileNav'
import List from './components/TagsMenu/legacy-style/List'

// import '../../css/frontEndMain.css'

Array.from(document.getElementsByTagName("h4")).forEach(item => {
    item.style.whiteSpace = "normal"
})
export default class FrontEndIndex extends React.Component{
    static contextType = Context;
    constructor(props){
        super(props)
        this.state = {
            imgSelectLoaded: document.querySelectorAll(".FilePreview--imageContainer"),
        }
    }
    spreadLetters = (title) => {
        let letters = Array.from(title).map((letter, index) => {
            return <div key={`${title}-leter-${index}`} className="title-letter white-font">{letter}</div>
        })
        return letters
    }
    
    render(){
            return(
                <Context.Consumer>
                    {() => {
                        return (
                            <div 
                                className="frontEndIndex-container"
                            >
                            <MobileNav 
                                context={this.context}
                            />
    
                            <div 
                            id="images" 
                            className={"images-container"}
                            >
                                <List 
                                    context={this.context}
                                    data={this.context.state.categoriesData}
                                />
                                <ImageSelect 
                                    data={this.context.state.artworkInfoData} 
                                    mobile={this.context.state.mobile}
                                    state={this.context.state}
                                    context={this.context}
                                    methods={{
                                        enlarge: this.context.enlarge,
                                        loadImage: this.context.loadImage,
                                        toggleMobile: this.context.toggleMobile,
                                        lazyLoad: this.context.lazyLoadImages
                                    }}
                                />
                                {!this.context.state.mobile && this.context.state.artworkInfoData ?                                         

                                    <div 
                                        className={`
                                        enlargeContainer 
                                        ${!this.context.state.mobile && !this.context.state.showLess ? "full-width" : ""}
                                        ${this.context.state.enlarge && this.context.state.enlarge.open === true ? "enlarge-scroll-left" : ""}
                                        `}
                                        id="enlargeContainer"
                                    >
                                        <Carousel 
                                            currentSlide={this.context.state.currentSlide.index}
                                            initialTransform={this.context.state.currentSlide.initialTransform}
                                            images={this.context.state.images}
                                            context={this.context}
                                            file={this.context.state.enlarge.file}
                                            counter={this.context.state.enlarge.counter}
                                        /> 
                                    </div>
                                    : null
                                    }                        
                                    
                            </div>
                            {this.context.state.mobile && this.context.state.artworkInfoData ?                                         
                                <div 
                                    className={`
                                    enlargeContainer 
                                    ${!this.context.state.mobile && this.context.state.showLess ? "full-width" : ""}
                                    ${this.context.state.enlarge && this.context.state.enlarge.open === true ? "enlarge-scroll-left" : ""}
                                    `}
                                    id="enlargeContainer"
                                >             
                                                {/* <div 
                                                    className={"enlarge-closeButton-container"}
                                                    >
                                                    <button 
                                                    className="enlarge-closeButton-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        // setCurrentArtwork(null)
                                                        this.context.closeEnlarge()
                                                    }}
                                                    >
                                                        <span>close</span>
                                                            <img className={"List-closeButton_img"} src="icons/svg/view-left.svg" alt="close icon"/>
                                                    </button>
                                                </div>    */}
                                        <div 
                                            className={"enlarge-closeButton-container"}
                                            style={{
                                                opacity: this.context.state.enlarge.open ? 1 : 0,
                                                width: "100%",
                                                justifyContent: "flex-end"
                                            }}
                                            >
                                            <button 
                                            className="Mobilenav-button Mobilenav_close"
                                            style={{
                                                border: "none",
                                                borderLeft: "1px solid black",
                                                maxWidth: "120px",
                                                height: "100%"
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                this.context.closeEnlarge()
                                            }}
                                            >
                                                <span>close ></span>
                                            </button>
                                        </div>  
                                        <Carousel 
                                            currentSlide={this.context.state.currentSlide.index}
                                            initialTransform={this.context.state.currentSlide.initialTransform}
                                            images={this.context.state.images}
                                            context={this.context}
                                            file={this.context.state.enlarge.file}
                                            counter={this.context.state.enlarge.counter}
                                        /> 
                                    </div>: null
                                }   
                        </div>
                        )
                    }}
                </Context.Consumer>
            )
    }
}