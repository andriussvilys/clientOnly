import React from 'react'
import axios from 'axios'

import Button from 'react-bootstrap/Button'

const Delete = (props) => {
    return(
        <div style={{display: "flex", justifyContent: "center"}}>
            <Button
            variant="danger"
            onClick={() => {
                axios.get('/api/artworkInfo')
                    .then(res => {
                        console.log(res.data)
                        let ids = res.data.map(obj => obj.fileName)
                        const idsSet = new Set(ids)
                        console.log(idsSet)
                        idsSet.forEach(id => {
                            axios.delete(`/api/artworkInfo/delete/${id}`)
                                .then(res => console.log(res))
                        })
                        
                    })
                    .catch(err => console.log(err))
            }}
            >
                Delete all DB records
            </Button>
        </div>
    )
}

export default Delete