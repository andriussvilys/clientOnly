import React from 'react'
import Category from '../TagsMenu/Category';

const About = (props) => {
    return(
        <div 
            onClick={(e) => {
                props.loadEnlarge(e, "portrait.jpg");
                setTimeout(() => {
                    if(document.getElementById("ArtworkInfo")){
                        // document.getElementById("ArtworkInfo").classList.add("show")
                        setTimeout(() => {
                            document.getElementById("ArtworkInfo").classList.add("info-up")
                        }, 200);
                    }
                }, 600)
            }}
        >
            <Category 
                clickable
                category="about"
                level="category"
                button
                showContent={() => {return}}
            />
        </div>
    )
}

export default About