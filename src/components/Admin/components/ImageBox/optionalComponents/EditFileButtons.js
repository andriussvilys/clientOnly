import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap' 

const EditFileButtons = (props) => {
    return (
        <div className="EditDetailContainer--button-wrapper">
            <Link to={`/admin/edit/${props.file.fileName}`}>
                <Button
                    onClick={(e) => {
                        props.context.fileDataMethods.serverFileToState(props.file)
                            .then(res => console.log(res))
                            .catch(rej => console.log(rej))
                    }}
                >
                    Edit
                </Button>
            </Link>
            <Button
                    className="delete-button"
                    onClick={() => {
                            props.onModalClick(props.file.fileName)
                    }}
                >
                    Delete
            </Button>
        </div>
    )
}

export default EditFileButtons