import React from 'react'

const ExitButton = (props) => {
    return(
        <div 
        className="controls-button controls-exitButton"
        onClick={(e) => {
            e.stopPropagation()
            const artworkInfo = document.getElementById("ArtworkInfo")
            const menu = document.getElementById("TagsMenu")
            const enlarge = props.context.state.enlarge
            if(artworkInfo &&  artworkInfo.classList.contains("info-up")){
                artworkInfo.classList.toggle("info-up")
                return
            }
            else if(menu.classList.contains("show-menu")){
                console.log("run close Menu")
                props.context.showMenu(e)
                return
            }
            else if(enlarge && enlarge.open){
                console.log("run close enlar")
                props.context.closeEnlarge(e)
            }
        }}
        >
            <img alt="close icon" src="/icons/svg/close.svg"/>
        </div>
    )
}

export default ExitButton