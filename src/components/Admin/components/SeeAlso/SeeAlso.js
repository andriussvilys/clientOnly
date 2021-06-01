import React from 'react'
import ImageBox from '../ImageBox/ImageBox'

const SeeAlso = (props) => {

    const highlighter = (fileName) => {
        return props.directory ? props.directory.includes(fileName) : false
    }

    return(
            <ImageBox
                file={props.file}
                directory={props.directory}
            >
                <div style={{border: "1px solid grey", padding: "2px"}}>
                    <p style={{fontSize: "10px"}}>use as See Also recommendation</p>
                    <form style={{display:"flex", justifyContent:"space-evenly"}}>
                        <div className="container-radio">
                            <input type="radio" 
                            name="useAsSeeAlso" 
                            id={`${props.file.fileName}-useAsSeeAlso__radio-yes`} 
                            value="yes" 
                            onChange={(e) => {
                                console.log("see also callback")
                                console.log(e.target)
                                props.onChange(props.file.fileName, props.parent, e)
                                // props.onChange(e, "seeAlso", props.file.fileName)
                            }}
                            checked={highlighter(props.file.fileName)}
                            />
                            <label 
                            htmlFor="useAsSeeAlso_yes"
                            id="useAsSeeAlso_yes"
                            >yes</label>
                        </div>
                        <div className="container-radio">
                            <input type="radio" 
                            name="useAsSeeAlso" 
                            id={`${props.file.fileName}-useAsSeeAlso__radio-no`} 
                            value="no" 
                            onChange={(e) => {
                                console.log("see also callback")
                                console.log(e.target)
                                props.onChange(props.file.fileName, props.parent, e)
                                // props.onChange(e, "seeAlso", props.file.fileName)
                            }}
                            checked={!highlighter(props.file.fileName)}
                            />
                            <label htmlFor="useAsSeeAlso_no">no</label>
                        </div>
                    </form>
                </div>
            </ImageBox>
    )
}

export default SeeAlso