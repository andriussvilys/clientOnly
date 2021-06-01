import React from 'react'

const PreviewBubbles = (props) => {
    const countBubbles = (file) => {
        let bubbles = []
        // const famName = file.background.artworkFamily
        const famName = props.file.familySequence.familyName
        // const famArray = props.relatedArtwork[famName].column.fileIds
        const famArray = props.relatedArtwork
        bubbles = famArray.map(item => {
            if(item === file.background.fileName){
                return <div 
                            key={`previewBubble-${item}`}
                            id={`previewBubble-${item}`}
                            onClick={(e) => {
                                props.enlarge(e, item)
                            }} 
                            className="previewBubble previewBubble-filled"
                        ></div>
            }
            return <div 
                        key={`previewBubble-${item}`}
                        id={`previewBubble-${item}`}
                        onClick={(e) => {
                            props.enlarge(e, item)}} 
                        className="previewBubble"
                    ></div>
            }
            )
            if(bubbles.length <= 1 ){
                bubbles = null
            }
        return bubbles
    }
    if(props.relatedArtwork){
        return(
            <div className="previewBubble-container" id="previewBubble-container">
                <div className="previewBubble-wrapper" id="previewBubble-wrapper">
                    {props.file && props.file.open ? countBubbles(props.file) : null}
                </div>
                {props.children}
            </div>
        )
    }
}

export default PreviewBubbles