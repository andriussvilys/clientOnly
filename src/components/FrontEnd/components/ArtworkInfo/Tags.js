import React from 'react'

const Tags = (props) => {
    /**
     * 
     * @param filterFunc takes a Promise function
     */
    const animateFilter = (filterFunc) => {
        const artworkOnDisplay = props.context.state.artworkOnDisplay
        let enlargeImg = props.file
        let scrollToId = props.file.fileName
        if(!Object.keys(artworkOnDisplay).includes(scrollToId)){
            let newImg = null
            Object.keys(artworkOnDisplay).forEach(objName => {
                const currentObj = artworkOnDisplay[objName]
                if(Object.values(currentObj).includes(enlargeImg.artworkFamily)){
                    newImg = currentObj.fileName
                }
            })
            scrollToId = newImg
        }
        let infoUpDelay = 0
        setTimeout(() => {
            filterFunc
                .then(res => {
                        setTimeout(() => {
                            props.context.scrollToHorizontal(null, "imageSelect"); 
                        }, 400);
                    }
                )
        }, infoUpDelay);
    }

    const tags = (file) => {
        let DOMthemes = null
        if(file.themes){
            let themes = file.themes
            themes = themes.map(theme => {return {
                "type": "theme", 
                "title": theme, 
                "onClick": props.context.tagFilter
                }
            })
            DOMthemes = themes.map((tag, index) => {
                return <button 
                key={`tag-${tag}${index}`}
                className="Tags-item_container"
                onClick={(e) => {e.stopPropagation(); 
                    if(props.tagsTrigger){
                        props.tagsTrigger()
                    }
                    // animateFilter(tag.onClick(e, tag.title, true))
                    animateFilter(tag.onClick("themes", tag.title))
                }}
                >
                    <span className="Tags-item_text">{tag.title}</span>
                </button> 
            })
        }

        let categories = Object.keys(file.category)
        categories = categories.map((category) => {
            return {
                "type": "category", 
                "title": category, 
                "onClick": props.context.tagFilter
            }
        })
        const DOMcategories = categories.map((tag, index) => {
            return <button 
            key={`category-${tag.title}${index}`}
            className="Tags-item_container"
            onClick={(e) => {e.stopPropagation(); 
                if(props.tagsTrigger){
                    props.tagsTrigger()
                }
                // animateFilter(tag.onClick(e, tag.title, true))
                animateFilter(tag.onClick("category", tag.title))
            }}
            >
                <span className="Tags-item_text">{tag.title}</span>
            </button>            
        })

        let subcategories = []
        categories.forEach(category => {
            subcategories = Object.keys(file.category[category.title]).map(subcategory => subcategory)
            subcategories = subcategories.map(subcategory => {
                return {
                    "type": "subcategory", 
                    "title": subcategory, 
                    "category": category.title, 
                    "onClick": props.context.tagFilter
                }
            })
        })
        const DOMsubcategories = subcategories.map(tag => {
            if(tag.title === "studio"){
                return null
            }
            return <button 
            key={`subcategory-${tag.title}`}
            className="Tags-item_container"
            onClick={(e) => {e.stopPropagation(); 
                if(props.tagsTrigger){
                    props.tagsTrigger()
                }
                // animateFilter(tag.onClick(e, tag.category, tag.title, {tagFilter: true}))
                animateFilter(tag.onClick("subcategory", tag.title))
            }}
            >
                <span className="Tags-item_text">{tag.title}</span>
            </button>
        })

        let listItems = []
        categories.forEach(category => {
            Object.keys(file.category[category.title]).forEach(subcategory => {
                let list = file.category[category.title][subcategory]
                if(list.length === 0){return}
                listItems = list.map(listItem => {return {
                    "type": "listItem", 
                    "title": listItem,
                    "category": category.title,
                    "subcategory": subcategory,
                    "onClick": props.context.tagFilter
                }
            })
            })
        })
        const DOMlistItems = listItems.map(tag => {
            return <button 
            key={`listitem-${tag.title}`}
            className="Tags-item_container"
            onClick={(e) => {e.stopPropagation(); 
                if(props.tagsTrigger){
                    props.tagsTrigger()
                }
                // animateFilter(tag.onClick(e,tag.category, tag.subcategory, tag.title, {tagFilter: true}))
                // this.tagFilter = (displayTrigger, value)
                animateFilter(tag.onClick("listitems", tag.title))
            }}
            >
                <span className="Tags-item_text">{tag.title}</span>
            </button>
        })
        let DOMtags = []
        DOMtags = [...DOMthemes, ...DOMsubcategories, ...DOMcategories, ...DOMlistItems]
        return DOMtags
    }
    return(
        <div  className="Tags-item_wrapper">
            <div 
                className={"Tags-item_selectors"}
            style={{display: "flex"}}>
                {tags(props.file)}  
            </div>
            <div 
                className={`Tags-item_container-closeButton ${props.context.state.showLess ? " Tags-item_container-closeButton_open" : ""}`}
                // className={`Tags-item_container-closeButton ${props.context.state.showExplorer ? " Tags-item_container-closeButton_open" : ""}`}
            >
                <button 
                    className="Tags-item_container"
                    onClick={() => {
                        props.onClose()
                    }}
                >
                    <span className="Tags-item_text">Close</span>
                </button>
            </div>
        </div>
    )
}

export default Tags