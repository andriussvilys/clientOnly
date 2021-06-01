import React from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button'

const UpdateAllArtworkInfo = (props) => {

    // const getSubcategories = (file) => {
    //     let categories = Object.keys(file.category)
    //     let subcategories = []
    //     categories.forEach(category => {
    //         subcategories = [...subcategories, ...Object.keys(file.category[category])]
    //     })
    //     return subcategories
    // }
    // const getListitems = (file) => {
    //     const categories = Object.keys(file.category)
    //     let listItems = []
    //     categories.forEach(category => {
    //         let subcategories = Object.keys(file.category[category])
    //         subcategories.forEach(sub => {
    //             if(!file.category[category][sub].length > 0){return}
    //             listItems = [...listItems, ...file.category[category][sub]]
    //         })
    //     })
    //     return listItems
    // }

    const commenceUpdate = () => {
        
        const allDocuments = axios.get('/api/artworkInfo')
        
        allDocuments.then(res => {
            const allDocumentNames = Object.keys(res.data)
            
            let progressCount = 0
            let updateLength = allDocumentNames.length
            console.log("allFams")
            console.log(res.data)
            console.log("allFamNames")
            console.log(allDocumentNames)
            console.log("updateLength")
            console.log(updateLength)

            res.data.forEach(artwork => {
                let fileData = artwork
                const fileName = artwork.fileName
                const nameRoot = fileName.slice(0, fileName.indexOf("."))
                const fileExtension = fileName.slice(fileName.indexOf("."), fileName.length)
    
                    // let displayTriggers = {category: [], subcategory: [], listitems: [], themes: [], year: "", location: ""}
                    // displayTriggers.category = Object.keys(fileData.category)
                    // displayTriggers.subcategory = getSubcategories(fileData)
                    // displayTriggers.listitems = getListitems(fileData)
                    // displayTriggers.themes = fileData.themes
                    // displayTriggers.year = fileData.year
                    // displayTriggers.location = fileData.location
                    // fileData.displayTriggers = displayTriggers

                fileData.thumbnailPath = `uploads/thumbnails/${nameRoot}-thumbnail${fileExtension}`
                fileData.mobilePath = `uploads/mobile/${nameRoot}-mob${fileExtension}`
                fileData.desktopPath = `uploads/desktop/${nameRoot}-desktop${fileExtension}`
    
                console.log(fileData)
                console.log("********************************************")
    
                // progressCount += 1
                // console.log(`${progressCount} / ${updateLength}`)
                // if(progressCount === updateLength){
                //     console.log('files updated')
                // }
    
                axios.put(`/api/artworkInfo/update/${artwork.fileName}`, fileData)
                .then(res => {
                    console.log(res)
                    progressCount += 1
                    console.log(`${progressCount} / ${updateLength}`)
                    if(progressCount === updateLength){
                        console.log('files updated')
                    }
                })
                })
            })
        }
    
    return(
        <Button
            disabled={props.disabled}
            onClick={() => {
                commenceUpdate()
            }}
        >
            Update all Artworks
        </Button>
    )
}

export default UpdateAllArtworkInfo