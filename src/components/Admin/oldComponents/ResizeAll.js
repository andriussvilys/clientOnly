import React from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

const ResizeAll = (props) => {
    return(
        <Button
            onClick={() => {
                props.fileNames.forEach(fileName => {
                    axios.post(`/resize/${fileName}`)
                        .then(res => { this.readImageDir()
                        })
                        .catch(err => alert(err))
                })
            }}
        >
            Resize all images
        </Button>
    )
}

export default ResizeAll