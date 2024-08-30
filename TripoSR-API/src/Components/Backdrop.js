import React from "react";
import BGVideo from '../Assets/Dark Blue and Light Blue Abstract Wave Motion Style Mobile Video Background.mp4'

const BackDrop = () =>{
    return(
        <div className="Image">
            <video src={BGVideo} autoPlay loop muted />

        </div>
    )

}

export default BackDrop