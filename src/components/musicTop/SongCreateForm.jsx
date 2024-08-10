import { useState, useEffect} from "react";


export default function SongCreateForm(){
    const [songData, setSongData] = useState( {title:"", content:""});

    

    return(
        <form className={'box m-4 p-4 has-background-light'}>
            <div className="field">
                    <label className="label">Titulo</label>
                    <div className="control">
                        <input className="input" 
                                type="text"
                                value={songData.title}
                                onChange={handleInputChange}
                                />
                    </div>
            </div>
        </form>

    )
}
