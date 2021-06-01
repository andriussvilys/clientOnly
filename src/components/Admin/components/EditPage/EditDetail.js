import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'
import FilePreview from '../FilePreviewiew'

const EditDetail = (props) => {
    return(
        <BrowserRouter>
                <div 
                    id={`EditDetail-${props.file.fileName}`}
                    className="EditDetail-container"
                    key={`fileLibrary-${props.file.fileName}`} 
                    style={{

                    }}
                >
                    <div 
                    >
                        <div>
                            <p className="subtitle">file name:</p>
                            <p style={{fontSize: "10px", fontWeight: "bold"}}>{props.file.fileName}</p>
                            <p className="subtitle">family name:</p>
                            <p style={{fontSize: "10px", fontWeight: "bold"}}>{!props.file.artworkFamily ? null : props.file.artworkFamily}</p>
                        </div>
                        <FilePreview 
                            key={`fileUpload-${props.file.fileName}-EditDetail-FilePreview`}
                            file={props.file}
                        />
                    </div>
                    <div style={{border: "1px solid grey", padding: "2px"}}>
                        <Link 
                        to={`/admin/edit/${props.file.fileName}`} 
                        >
                            Edit
                        </Link>
                    </div>
        
                </div>
        </BrowserRouter>
    )
}

export default EditDetail


