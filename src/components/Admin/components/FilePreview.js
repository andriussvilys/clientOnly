import React from 'react';

export default class FilePreview extends React.Component{

    fileContainer = (fileType, file) => {

        //files in server dont have 'preview' property, and files in state dont have filePath
        const previewSource = file.filePath ? `/${file.mobilePath}` : file.preview

        if(fileType.match('image')){
            return <img className="ImagesPreview--image" alt={file.fileName} src={previewSource} />
          
        }
        if(fileType.match('video')){
            return(
                <video 
                className="ImagesPreview--image" 
                controls
                >
                    <source src={previewSource} type={fileType} />
                    Your browser does not support the video tag.
                </video> 
            )
        }
        if(fileType.match('audio')){
            return(
                <audio 
                className="ImagesPreview--image" 
                controls
                >
                    <source src={previewSource} type={fileType} />
                    Your browser does not support the audio tag.
                </audio> 
            )
        }
        if(fileType.match("application/pdf")){
            return(
                    <iframe 
                    src={previewSource} 
                    style={{width: "100%"}}
                    title={`iframe-${this.props.file.fileName}`}
                    ></iframe>
            )
        }
    }

    render(){
        if(this.props.noWrapper){
            return this.fileContainer(this.props.file.fileType, this.props.file)
        }
        else{
            return(
            <div 
                className="ImagesPreview--imageContainer"
                onClick={() => this.props.onClick()}
            >
                {this.fileContainer(this.props.file.fileType, this.props.file)}
            </div>
            )
        }

    }
}

