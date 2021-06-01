import React, { Fragment } from 'react'
import ViewControls from '../ViewControls'

export default class ArtworkTitle extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open: false,
            infoUp: false
        }
        this.artworkTitle = () => {
    
            const artworkTitle = () => {

                let artworkFamily = this.props.file.artworkFamily
                if(artworkFamily === "none"){
                    artworkFamily = "–"
                }
                if(artworkFamily === "Poilsis"){
                    artworkFamily = "Daiktai sandėlyje"
                }

                let artworkTitle = this.props.file.artworkTitle
                if(!artworkTitle){
                    artworkTitle = artworkFamily
                }

                // if(this.props.file.artworkTitle){
                    return <Fragment>  
                            <em className="ArtworkInfo_artworkTitle">{artworkTitle}</em>
                    </Fragment>
            }
                return (
                    <div className="ArtworkInfo-title_wrapper" id="ArtworkInfo-Title">
                        <ViewControls 
                            context={this.props.context}
                            showInfoText={this.props.context.state.info.height < 100 ? "Less info" : "More info"}
                            // showInfoText={this.props.infoUp ? "Less info" : "More info"}
                            showInfo={this.props.showInfo}
                            infoUp={this.props.infoUp}
                            children={this.props.dots}
                        >
                            {this.props.dots}
                        </ViewControls>
                        {this.props.file ? 
                            <div className={"ArtworkInfo-title_content ArtworkInfo_padded"}>

                                {artworkTitle()}

                            </div>
                            : null}
                    </div>
                )
        }
    }
    render(){
        return(
                <Fragment>
                    {this.artworkTitle()}
                </Fragment>
        )
    }
}


