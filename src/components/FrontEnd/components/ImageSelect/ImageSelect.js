import React from 'react'
import FilePreview from '../FilePreview'

const ImageSelect = (props) => {

    const createPreviewsALL = (data) => {
        if(data){
            // let previews = Object.keys(data).map((objName) => {
            let previews = props.state.displayOrder.general.map((objName, index) => {
              const halfSize = props.state.artworkInfoData[objName].naturalSize.naturalWidth < props.state.artworkInfoData[objName].naturalSize.naturalHeight ? "halfSize" : null
              if(props.state.artworkOnDisplay[objName]){
                return <FilePreview 
                        key={`imageSelect-${objName}`}
                        containerClassName={`FilePreview--imageContainer ${halfSize} ${index%2 == 0 ? "left-aligned" : "right-aligned"} `}
                        className="imageSelect-FilePreview loadByDefault" 
                        onClick={e => {
                          props.methods.loadImage(objName)
                        }}
                        file={data[objName]} 
                        mobile={props.mobile}
                        />
              }
              else{
                return <FilePreview 
                        key={`imageSelect-${objName}`}
                        containerClassName={`
                        FilePreview--imageContainer 
                        FilePreview--imageContainer__empty
                        ${halfSize}`}
                        className="imageSelect-FilePreview" 
                        onClick={e => props.methods.loadEnlarge(e, objName)}
                        file={data[objName]} 
                        mobile={props.mobile}
                        />
              }
            })
            return <div 
                      id={props.customId || "imageSelect"}
                      className={
                        `imageSelect-container 
                        ${props.customClass}
                        ${props.context.state.showExplorer ? "explorer-view" : ""}
                        `}
                      >
                        <div className={`imageSelect-wrapper ${document.documentElement.clientWidth > 721 ? "full-height" : null} ${props.sideScroll ? "side-scroll" : ""}`}>
                          {previews}
                          {props.mobile ? <div id="spanner" style={{width: "calc(100% - 15vw)", flex: "1 1 100%"}}></div> : null}
                          {setTimeout(() => {
                            lazyLoadImages()
                          }, 50)}
                        </div>
                    <div className={"imageSelect-buffer"}></div>
                    </div>
        }
        else{return null}  
    }

    const lazyLoadImages = () => {  
        const images = document.querySelectorAll(".loadByDefault")

        if(images){
          const preloadImage = (img) => {
            const src = img.getAttribute("data-src")
            if(!src){
              return
            }
            img.src=src
          }
      
          const imgOptions = {
            threshold: 0,
            root: null,
            rootMargin: "0px 0px 300px 0px"
          }
      
          const imgObserver = new IntersectionObserver((entries, imgObserver) => {
            entries.forEach(entry => {
              if(!entry.isIntersecting){
                return
              }
              else{
                preloadImage(entry.target);
                imgObserver.unobserve(entry.target)
              }
            }, imgOptions)
          })
      
          images.forEach(image => {
            imgObserver.observe(image)
          })
        }
      }
      
    return(
      createPreviewsALL(props.data)
    )
}

export default ImageSelect