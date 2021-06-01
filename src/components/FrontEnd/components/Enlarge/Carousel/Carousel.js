import React, { useEffect, useState } from 'react'
import { useGesture } from 'react-use-gesture'
import ArtworkInfo from '../../ArtworkInfo/ArtworkInfo'

import styles from './css/index.module.scss'

const Carousel = props => {
    const containerRef = React.useRef()
    const dot_active = React.useRef()
    const dot_container = React.useRef()
    const dot_list = React.useRef()
    const slideContainerRef = React.useRef()
    const zoomRef = React.useRef(null)
    const [mobile, setMobile] = useState(window.document.body.getBoundingClientRect().width > 720 ? false : true)
    function checkDocumentSize() {
        setMobile(window.document.body.getBoundingClientRect().width > 720 ? false : true);
    }
    let posX = 0
    let posY = 0
    let transformX = 0
    
    window.onresize = checkDocumentSize;

    const [ infoPosition, setInfoPosition ] = useState({
        height: 100,
        counter: 0
    })
    
    const [slidePosition, setSlidePosition] = useState({
        file: props.file,
        swiped: false,
        smooth: true,
        currentSlide: props.currentSlide,
        prevTransform: props.initialTransform,
        currentTransform: props.initialTransform
    })

    const zoomDefault =  {
        pinch: null,
        zoom: null,
        smooth: false,
        scale: 1,
        distance: 0,
        origin: {
            x: 0,
            y: 0
        },
        dotOrigin: {
            x: 0,
            y: 0
        },
        initialOrigin: null,
        position: {
            x: 0,
            y: 0
        },
        pinchDistance: 0,
    }
    const [zoom, setZoom] = useState({...zoomDefault})

    const slideTo_dot = () => {
        if(dot_active && dot_active.current){
            const slide_indent = dot_list.current.clientWidth / props.images.length
            // let left = (slidePosition.currentSlide - 1) * 20
            let left = (slidePosition.currentSlide - 1) * slide_indent
            dot_container.current.scroll(left, 0);
        }
    }

    const slideTo = (index) => {
        let slideToIndex = index;
        if(slideToIndex < 0){
            slideToIndex = props.images.length - 1; 
        }
        else if(slideToIndex > props.images.length - 1){
            slideToIndex = 0;
        }
        const newTransfrom = -((100 / props.images.length) * slideToIndex)
        let delay = zoom.zoom ? 250 : 0
        if(zoom.zoom){
            setZoom({...zoomDefault})
        }
        let nextImage = null;
        if(props.file){
            const artworkFam = props.context.state.artworkInfoData[props.file].artworkFamily
            nextImage = props.context.state.relatedArtwork[artworkFam].column.fileIds[slideToIndex]
        }
        else{return}

        setTimeout(() => {            
            setSlidePosition({
                ...slidePosition,
                smooth: true,
                file: nextImage,
                currentSlide: slideToIndex,
                currentTransform: newTransfrom,
                prevTransform: newTransfrom,
            })
        }, delay);
    }

    const dots = (imageList) => {
        const dots = imageList.map((image, index) => {
            return <li 
            onClick={() => {
                slideTo(index)
            }}
            ref={index === slidePosition.currentSlide ? dot_active : null}
            key={`carouselDot-${index}`} 
            className={`${styles.dot} ${index === slidePosition.currentSlide ? styles.dot_active : ""}`}
            ></li>
        })
        return <div ref={dot_container} className={styles.dotContainer}>{imageList.length < 2 ? null : <ul ref={dot_list} className={styles.dotList}>{dots}</ul>}</div>
    }
    const arrowNext = () => {
        if(props.images.length < 2){
            return
        }
        if(mobile)return
        return <div 
            className={styles.arrowNext}
            onClick={() => {
                slideTo(slidePosition.currentSlide + 1)
            }}
        ></div>
    }
    const arrowPrev = () => {
        if(props.images.length < 2){
            return
        }
        if(mobile)return
        return <div 
            className={styles.arrowPrev}
            onClick={() => {
                slideTo(slidePosition.currentSlide - 1)
            }}
        ></div>
    }

    const renderImages = (data) => {
        return data.map((image, index) => {
        return (
            <div
            id={`SLIDE-${index}`}
            className={`${styles.slide} ${zoom.pinch ? styles.showOverflow : ""}`}
            key={`${image}-${index}`}
            style={{width: `${100 / props.images.length}%`}}
            >                    
                <img 
                    style={slidePosition.currentSlide === index ? 
                        {transform: `scale(${zoom.scale}) translate(${zoom.position.x}%, ${zoom.position.y}%)`,
                         transformOrigin: `${zoom.origin.x}% ${zoom.origin.y}%`
                        } : {}}
                    className={`${zoom.smooth && slidePosition.currentSlide === index ? styles.smoothSlide : ""}`}
                    ref={slidePosition.currentSlide === index ? zoomRef : null}
                    src={image}
                    alt={image}
                />
            </div>
        )
        })
    }

    const moveStartHandeler = (state) => {
    }
    const moveHandler = (state, options) => {
        if(zoom.zoom){return}

        const containerWidth = containerRef.current.clientWidth;
        const slideCount = props.images.length
        const slideWidth = 100 / slideCount

        let  transform = slidePosition.currentTransform + ((state.delta[0] * options.direction * options.moveSpeed * 100 / containerWidth) / slideCount)
        transform = Math.round((transform + Number.EPSILON) * 10) / 10

        const margin = (slideWidth / 3)

        if(transform > 0){
            transform = 0
        }
        if(transform < -100 + slideWidth){
            transform = -100 + slideWidth
        }
        // if(transform > margin){
        //     transform = 0
        // }
        // if(transform < -100 + margin){
        //     transform = -100 + slideWidth
        // }

        let index = Math.abs(Math.round(transform / slideWidth))
        if(index > slideCount -1){
            index = slideCount - 1
        }

        return setSlidePosition({ 
            ...slidePosition,  
            currentSlide: index,
            currentTransform: transform,
            smooth: false
        })
    }
    const moveEndHandler = (state) => {
        if(zoom.zoom){return}

        const slideCount = props.images.length
        const slideWidth = 100 / slideCount

        let currentTransform = slidePosition.currentTransform

        let index = Math.abs(Math.round(currentTransform / slideWidth))
        if(index > slideCount -1){
            index = slideCount - 1
        }

        console.log({current: slidePosition.currentSlide, next: index})

        slideTo(index)
    }
    const zoomPanHandler = (state) => {
        const {x, y} = {
            x: zoom.origin.x + (state.delta[0]/5)*zoom.scale, 
            y: zoom.origin.y + (state.delta[1]/5)*zoom.scale
        }
        setZoom({
            ...zoom,
            smooth: false,
            origin: {x, y}
        })
    }
    const toggleInfo = state => {

        // 0 = UP, 100 = DOWN
        if(Math.abs(state.direction[1]) > Math.abs(state.direction[0])){
            let direction = mobile ? state.direction[1]*-1 : state.direction[1]
            let newHeight = direction > 0 ? 0 : 100;
            // setInfoPosition({height: newHeight, counter: infoPosition.counter + 1})
            props.context.showInfo(newHeight)
            return 1 
        }
        return 0
    }
    const genericOptions = {
        domTarget: slideContainerRef,
        filterTaps: true,
        lockDirection: true,
        eventOptions: {
            passive: false
        }
    }
    const bind = useGesture(
        {
            onDragStart: (state) => {
                moveStartHandeler()
            },
            onDrag: (state) => {
                if(state.tap){
                    if(state.event.touches)return
                    const targetRect = containerRef.current.getBoundingClientRect()
                    const clientPosition = {x: state.initial[0], y: state.initial[1]}
                    const targetOffset = {x: targetRect.x, y: targetRect.y}
                    const imageRect = zoomRef.current.getBoundingClientRect();
                    const imageOffset = {x: imageRect.x  - targetOffset.x, y: imageRect.y - targetOffset.y}
                    const cursorOnImage = {
                        x: ((clientPosition.x - targetOffset.x - imageOffset.x)*100)/imageRect.width, 
                        y: ((clientPosition.y - targetOffset.y - imageOffset.y)*100)/imageRect.height
                    }
                    const dotOrigin = {
                        x: clientPosition.x - targetOffset.x, 
                        y: clientPosition.y - targetOffset.y
                    }
                    const scale = zoom.scale == 1 ? 2 : 1;
                    const zoomStatus = scale > 1 ? true : false;
                    setZoom({...zoom, 
                        smooth: true,
                        origin: cursorOnImage, 
                        dotOrigin, scale, 
                        zoom:zoomStatus
                    })
                }
            },
            onDragEnd: (state) => {
                if(state.swipe[1] != 0){
                    if(toggleInfo(state) > 0){
                        return
                    }
                }
                else{
                    const index = slidePosition.currentSlide - state.swipe[0]
                    slideTo(index)
                }
            },
            onPinch: state => {
                // if(!mobile){state.event.preventDefault()}
                state.event.preventDefault()

                const targetRect = containerRef.current.getBoundingClientRect()
                const currentImg = zoomRef.current.getBoundingClientRect()
                const imgOffset = {x: currentImg.x - targetRect.x, y: currentImg.y - targetRect.y}

                let dotOrigin = zoom.dotOrigin;

                let initialOrigin = zoom.initialOrigin
                dotOrigin = {
                    x: (state.origin[0] - targetRect.x), 
                    y: (state.origin[1] - targetRect.y),
                }
                if(!zoom.initialOrigin){
                    initialOrigin = {
                        x: ((dotOrigin.x - imgOffset.x)*100)/currentImg.width, 
                        y: ((dotOrigin.y - imgOffset.y)*100)/currentImg.height,
                    };
                    let origin = initialOrigin
                    return setZoom({...zoom, initialOrigin, dotOrigin, origin, smooth: false, zoom: true})
                }
                else{
                    const pinchDistance = state.da[0]
                    let scale = pinchDistance / 100
                    if(scale < 0.5){scale = 0.5}
                    const difference = {x: dotOrigin.x - zoom.dotOrigin.x, y: dotOrigin.y - zoom.dotOrigin.y}
                    let position = {x: 0, y: 0}
                    position = {
                        x: zoom.position.x + (((difference.x)*100)/currentImg.width),
                        y: zoom.position.y + (((difference.y)*100)/currentImg.height),
                    }
                    setZoom({...zoom, 
                        position: position,
                        dotOrigin,
                        scale
                    })
                }
            },
            onPinchEnd: state => {
                if(!mobile){state.event.preventDefault()}
                setZoom({...zoomDefault, smooth: true, origin: zoom.initialOrigin, zoom: false})
            },
            onWheelStart: state => {
                state.event.preventDefault()
            },
            onWheel: (state) => {
                state.event.preventDefault()
                if(toggleInfo(state) > 0){
                    return
                }
                if(props.images.length < 2){
                    return
                }
                moveHandler(state, {moveSpeed: 2, direction: -1})
            },
            onWheelEnd: state => {
                state.event.preventDefault()
                moveEndHandler(state)
            },
            onMove: state => {
                if(!zoom.zoom)return
                zoomPanHandler(state)
            },
        },
        {...genericOptions},
    )

    // useEffect(() => {
    //     setInfoPosition({height: 100})
    // }, [props])

    useEffect(() => {
        slideTo(props.currentSlide)
    }, [props.counter])

    useEffect(() => {
        slideTo_dot()
    }, [slidePosition])

    useEffect(bind, [bind])


    return(
            <div 
                id="container_main"
                ref={containerRef}
                className={`${styles.container} ${zoom.pinch ? styles.showOverflow : ""}`}
            >
            {arrowPrev()}
            <div 
                id={"slideContainer"}
                className={`${styles.slideContainer} ${slidePosition.smooth ? styles.smoothSlide : ""} ${zoom.pinch ? styles.showOverflow : ""} ${zoom.zoom ? styles.zoomOut : ""}`}
                ref={slideContainerRef}
                style={{
                    width: `${100 * props.images.length}%`,
                    transform: `translateX(${slidePosition.currentTransform}%)`
                }}
            >
                {renderImages(props.images)}
            </div>
            {arrowNext()}
                <ArtworkInfo
                    counter={infoPosition.counter}
                    transform={infoPosition.height}
                    context={props.context}
                    mobile={mobile}
                    file={props.context.state.artworkInfoData[slidePosition.file]}
                    artworkInfoData={props.context.state.artworkInfoData}
                    info={props.context.state.info}
                    dots={dots(props.images)}
                />
        </div>
    )
}

export default Carousel