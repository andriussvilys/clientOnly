import React, { Fragment } from "react";
import FilePreview from "../FilePreview";
import { useGesture } from 'react-use-gesture'
import Tags from "./Tags";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import ArtworkTitle from "./ArtworkInfo/ArtworkTitle";
import ImageSelect from "../ImageSelect/ImageSelect";
import PreviewCounter from "./PreviewCounter";
import ViewControls from "./ViewControls";

import './css/artworkInfo.css';

const ArtworkInfo = props => {
    const ArtworkInfoWrapperRef = React.useRef(null)
    const [state, setState] = React.useState({tagsTrigger: false, infoUp: false, height: 100, direction: null})

  const locationAndYear = () => {
      let location = props.file.location ? props.file.location : null
      let year = props.file.year ? props.file.year: null
      if(location && year){
          return <div key={"location/year"} className="ArtworkInfo_locationYear">({location}. {year})</div>
      }
      if(!year && location){
          return <div key={"location"} className="ArtworkInfo_locationYear">({location})</div>
      }
      if(year){
          return <div key={"year"} className="ArtworkInfo_locationYear">({year})</div>
      }
      // else{ return null}
      else{ return <div key={"location/year"} className="ArtworkInfo_locationYear"></div>}
  }

    const title_post = () => {
      let artworkFamily = props.file.artworkFamily
      if(artworkFamily === "none"){
          artworkFamily = "–"
      }
      if(artworkFamily === "Poilsis"){
          artworkFamily = "Daiktai sandėlyje"
      }

      let artworkTitle = props.file.artworkTitle
      if(!artworkTitle){
          artworkTitle = artworkFamily
      }

      return <div 
        className={
        props.file.artworkTitle ? 
        "ArtworkInfo_artworkFamily" :
        "ArtworkInfo_artworkTitle"
        }
      >        
            {props.file.artworkTitle && props.file.artworkFamily !== "none" ? 
                <Fragment>
                    <span className={"ArtworkInfo_artworkTitle_secondary"}>part of </span>
                    <em className="ArtworkInfo_artworkFamily_variable ArtworkInfo_artworkTitle_secondary">{artworkFamily}</em>
                </Fragment> :
                <Fragment>
                    <span className={"ArtworkInfo_artworkTitle_secondary"}></span>
                    <em className="ArtworkInfo_artworkFamily_variable ArtworkInfo_artworkTitle_secondary"></em>
                </Fragment>
            }
      </div>
    }

     const seeAlso = () => {
      let seeAlsos = [];
      if (props.file.seeAlso.length > 0) {
        seeAlsos = props.file.seeAlso.map((fileName) => {
          return (
            <FilePreview
              loadbydefault={"true"}
              key={`ArtworkInfo-${fileName}`}
              className="ArtworkInfo-preview"
              containerClassName="ArtworkInfo-preview-container"
              file={props.artworkInfoData[fileName]}
              onClick={(e) => props.context.loadImage(fileName)}
              id={`seeAlso-${fileName}`}
            />
          );
        });
        seeAlsos = (
          <div
            key={"SeeAlso-related"}
            className="SeeAlso-related SeeAlso-wrapper"
          >
            <div className="subtitle_seeAlso">see also:</div>
            <div className="SeeAlso-related_images">{seeAlsos}</div>
          </div>
        );
      }
      let DOMS = [];
      if (
        props.context.state.relatedArtwork[props.file.artworkFamily]
          .column.fileIds.length > 1
      ) {
        let otherInFam = props.context.state.relatedArtwork[
          props.file.artworkFamily
        ].column.fileIds.filter(
          (fileName) => fileName !== props.file.fileName
        );
        DOMS = otherInFam.map((fileName) => {
          return (
            <FilePreview
              loadbydefault={"true"}
              key={`ArtworkInfo-${fileName}`}
              className="ArtworkInfo-preview"
              containerClassName="ArtworkInfo-preview-container"
              file={props.artworkInfoData[fileName]}
              onClick={(e) => props.context.loadEnlarge(e, fileName)}
              id={`seeAlso-${fileName}`}
            />
          );
        });
        DOMS = (
          <div
            key={"SeeAlso-previous"}
            className="SeeAlso-previous SeeAlso-wrapper"
          >
            <div className="subtitle_seeAlso">related:</div>
            <div className="SeeAlso-related_images">{DOMS}</div>
          </div>
        );
      }
      let combined = [DOMS];
      combined = [seeAlsos];
      const singleContainer = () => {
        if (Array.isArray(DOMS) || Array.isArray(seeAlsos)) {
          return true;
        } else {
          return false;
        }
      };
      return (
        <div
          className={
            singleContainer()
              ? "ArtworkInfo-seeAlso-container single-container"
              : "ArtworkInfo-seeAlso-container"
          }
        >
          {combined}
        </div>
      );
    };
     const descriptions = () => {
      return (
        <Fragment>
          {props.file.artworkDescription ? (
            <div className="ArtworkInfo--artworkDescription ArtworkInfo--descriptions_instance">
              {ReactHtmlParser(props.file.artworkDescription)}
            </div>
          ) : null}
          {props.file.familyDescription ? (
            <div className="ArtworkInfo--familyDescription ArtworkInfo--descriptions_instance">
              {ReactHtmlParser(props.file.familyDescription)}
            </div>
          ) : null}
        </Fragment>
      );
    };
    const showInfo = (e) => {
      //0 = UP, 100 = DOWN

      const newHeight = props.context.state.info.height == 0 ? 100 : 0
      // setState({...state, infoUp: !state.infoUp, height: newHeight})
      props.context.showInfo(newHeight)
      return
    };
    const secondaryInfo = () => {
      return <Fragment>
        <div className="ArtworkInfo_padded">
          <div className="ArtworkInfo-title_secondary">
            {locationAndYear()}
            {title_post()}
          </div>
          {descriptions()}
          <div
            key={"ArtworkInfo-container_seealso"}
            className="ArtworkInfo-container_seealso"
          >
            {seeAlso()}
          </div>         
            <Tags 
              file={props.file} 
              context={props.context} 
              tagsTrigger={() => {
                // setState({...state, tagsTrigger: true})
                  props.context.toggleExplorer()
              }}
              onClose={() => {
                // setState({...state, tagsTrigger: false})
                props.context.toggleExplorer({close: true})
              }}
            />
        </div>
      </Fragment>
    }
    const placeholder = {
      artworkDescription: "PLACEHOLDER",
      artworkFamily: "PLACEHOLDER",
      artworkTitle: "PLACEHOLDER",
      desktopPath: "uploads/desktop/malonioji_1-desktop.jpg",
      displayMain: true,
      familyDescription: "PLACEHOLDER",
      familyDisplayIndex: 2,
      fileName: "malonioji_1.jpg",
      filePath: "/uploads/malonioji_1.jpg",
      fileType: "image/jpeg",
      location: "Vilnius, Lithuania",
      mobilePath: "uploads/mobile/malonioji_1-mob.jpg",
      naturalSize: {naturalWidth: 721, naturalHeight: 1080},
      seeAlso: [],
      themes: [],
      thumbnailPath: "uploads/thumbnails/malonioji_1-thumbnail.jpg",
      year: "2015",
    }
    const moveStartHandeler = (state) => {
    }
    const verticalMoveHandler = (gestureState, options) => {
        let heightValue = null;
        heightValue = state.height + (options.direction * gestureState.delta[1])
        if(heightValue < -100){
            heightValue = -100
        }
        if(heightValue > 0){
            heightValue = 0
        }
        setState({...state, height: heightValue})
    }
    const moveHandler = (gestureState, options) => {
      return verticalMoveHandler(gestureState, 
        {direction: options.direction, speed: options.speed}
        );
    }
    const moveEndHandler = (gestureState) => {
        if(gestureState.direction){
            setState({...state, direction: null});
        }
        props.context.showInfo(gestureState.event, {height: state.height})
    }
    const genericOptions = {
      filterTaps: true,
      domTarget: ArtworkInfoWrapperRef,
      lockDirection: true,
      eventOptions: {
          passive: false
      }
      // threshold: 10
  }
    const bind = useGesture(
      {
          onDragStart: () => {
              moveStartHandeler()
          },
          onDrag: (gestureState) => {
              moveHandler(gestureState, {speed: 2, direction: -1})
          },
          onDragEnd: (gestureState) => moveEndHandler(gestureState),
          onWheelStart: () => {
              moveStartHandeler()
          },
          onWheel: (gestureState) => {
            gestureState.event.preventDefault()
            moveHandler(gestureState, {speed: 1, direction: 1})
          },
          onWheelEnd: gestureState => {
            gestureState.event.preventDefault()
              moveEndHandler(gestureState)
          },
      },
      {...genericOptions},
  )

    React.useEffect(() => {
      setState({...state, height: props.transform})
    }, [props.counter])

    React.useEffect(() => {
      setState({...state, height: props.transform})
    }, [props.transform])

    // React.useEffect(() => {
    //   setState({...state, height: props.context.state.info.height})
    // }, [props.context.state.info.height])
  

    return(
      <div
        className={`ArtworkInfo-container`}
        id="ArtworkInfo-container"
      >
        <div 
        className={`ArtworkInfo-wrapper_main`}
        style={{transform: `translateY(${props.context.state.info.height}%`}}
        // style={{transform: `translateY(${state.height}%`}}
        ref={ArtworkInfoWrapperRef}
        >
          {props.children}
          <ArtworkTitle 
              file={props.file ? props.file : {background: placeholder}} 
              context={props.context} 
              showInfo={
                () => showInfo()
              }
              infoUp={state.height > 0 ? false : true}
              dots={props.dots}
            />
            <div
              key={"ArtworkInfo-wrapper"}
              className={`ArtworkInfo-wrapper secondaryInfo`}
              id="ArtworkInfo"
            >
                {props.file ? 
                  secondaryInfo() : null
                }   
              {props.context.state.mobile ? 
                <ImageSelect
                  customClass={`${props.context.state.showLess ? "ArtworkInfo-toggleTags" : ""}`}
                  // customClass={`${props.context.state.showExplorer ? "ArtworkInfo-toggleTags" : ""}`}
                  customId="ImageSelect-info"
                  sideScroll
                  data={props.context.state.artworkInfoData}
                  mobile={props.context.state.mobile}
                  state={props.context.state}
                  context={props.context}
                  methods={{
                    enlarge: props.context.enlarge,
                    loadImage: props.context.loadImage,
                    toggleMobile: props.context.toggleMobile,
                    lazyLoad: props.context.lazyLoadImages,
                  }}
                /> : null
              }
            </div>
        </div>
      </div>
    )
};

export default ArtworkInfo;