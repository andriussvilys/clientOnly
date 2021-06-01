import React, { Fragment } from 'react'

const Accordion = (props) => {
    const collapse = (e) => {
        e.stopPropagation()
        let caret = null
        //if clicked on caret
        if(e.target.classList.contains("FilterTree-caret")){ caret = e.target}
        else{
            if(props.collapse){
                console.log(e.target)
                if(e.target.classList.contains("title-letter")){
                    caret = e.target.parentNode.nextSibling
                }
                else{
                    caret = e.target.nextSibling
                }
            }
        }
        caret.classList.toggle("FilterTree-caret_down")
        const list = document.getElementById(props.listId)

        let timeout = 1
        if (!list.classList.contains("FilterTree-list_closed") && !list.style.maxHeight){
            list.style.maxHeight = `${list.scrollHeight}px`
            timeout += 200
        }
        setTimeout(() => {      
            if (!list.classList.contains("FilterTree-list_closed")) {
                list.style.maxHeight = 0;
            } 
            else {
            list.style.maxHeight = list.scrollHeight + "px";
            // const parent = document.getElementById("FilterTree-list_all")
            const parent = document.getElementById(`${props.mainContainer}`)

                if(parent.style.maxHeight){
                    setTimeout(() => {
                        parent.style.maxHeight = `${parent.scrollHeight}px` 
                    }, 300);
                }
            }
            list.classList.toggle("FilterTree-list_closed")
            return
        }, timeout);
    }

    return(
        <div
        className={`FilterTree-form list-item ${props.containerClass ? props.containerClass : ""}`}
        >   
            <div 
            className="FilterTree-title FilterTree-title_categories"
            onClick={e => {
                if(props.collapse){
                    collapse(e)
                }
                else{return}
            }}
            >
                {props.children}
            </div>
            {props.listId ? 
                <img 
                className="FilterTree-caret" 
                src="icons/triangle.svg" 
                alt="open or close filter category"
                onClick={(e) => {
                    collapse(e)
                }}
                ></img>
                : null
            }
        </div>
    )
}
export default Accordion