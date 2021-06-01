import React from 'react';

const ArtworkInfo = (props) => {
    return(
            <div>
                <div className="imageInfo--box">
                    <div>
                    <p>Add Artwork title:</p> 
                    <p className="subtitle">(different from family name):</p>
                    </div>
                    <input 
                    value={props.file.artworkTitle || ""}
                    type="text" 
                    onChange={(e) => props.context.onChange(e, 'artworkTitle', props.file.fileName)} 
                    />
                </div>

                <div className="imageInfo--box imageInfo--box-displayMain">
                <span>display on main page:</span>
                <form className="artworkinfo--form">
                    <div className="container-radio">
                        <label htmlFor="mainDisplayIndex_yes">yes</label>
                        <input 
                        type="radio" 
                        // defaultChecked 
                        checked={props.state.fileData.files[props.file.fileName].displayMain}
                        name="mainDisplayIndex" 
                        id="mainDisplayIndex__yes" 
                        value={"yes"} 
                        onChange={(e)=>{props.onChange(e, "displayMain", props.file.fileName)}}
                        />
                    </div>
                    <div className="container-radio">
                        <label htmlFor="mainDisplayIndex_no">no</label>
                        <input 
                        checked={!props.state.fileData.files[props.file.fileName].displayMain}
                        type="radio" 
                        name="mainDisplayIndex" 
                        id="mainDisplayIndex__no" 
                        value={"no"} 
                        onChange={(e)=>{props.onChange(e, "displayMain", props.file.fileName)}}
                        />
                    </div>
                </form>
                
                </div>

                <div className="imageInfo--box"></div>

                {/* DESCRIPTION */}
                <div className="imageInfo--box"  style={{display: "block"}}>
                    <div>
                        <p>Artwork description:</p> 
                        <p className="subtitle">this is describes particulars of a work in a series or exhibit in a show</p>
                    </div>
                    <textarea
                        value={props.file.artworkDescription || ""}
                    onChange={
                        (e) => props.context.onChange(e, "artworkDescription", props.file.fileName)
                    }
                    style={{width: "100%"}}
                    ></textarea>
                </div>
            </div>
    )
  }

  export default ArtworkInfo