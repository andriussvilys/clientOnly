import React, { Fragment } from 'react'
import ArtworkInfo from './ArtworkInfo'
import PreviewBubbles from './PreviewBubble'
import Controls from './Controls'
import PreviewCounter from './PreviewCounter'
import ArtworkTitle from './ArtworkInfo/ArtworkTitle'

const Combined = (props) => {
    const spreadLetters = (title) => {
        let letters = Array.from(title).map((letter, index) => {
            return <div key={`${title}-leter-${index}`} className="title-letter white-font">{letter}</div>
        })
        return letters
    }
    return(
        // <div className="enlarge-info" id="enlarge-info">
            props.context.state.enlarge && props.context.state.enlarge.foreground  ? 
                <Fragment>
                    <ArtworkInfo 
                        file={props.context.state.enlarge} 
                        context={props.context}
                        artworkInfoData={props.context.state.artworkInfoData} 
                        loadEnlarge={props.context.loadEnlarge} 
                        hideArtworkInfo={props.context.hideArtworkInfo}
                        mobile={props.mobile}
                    />
                </Fragment> : null
        // </div>
    )
}

export default Combined