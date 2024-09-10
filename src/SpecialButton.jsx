import { ACTION } from "./Calculator";


export default function SpecialButton({dispatch, sign}){
    const style={
        special_sign:{
            backgroundColor: '#a1a1a1',
        }
    };
    if (sign=='!'){
        return(
            <button className="special_sign" style={style.special_sign}
                onClick={()=>dispatch({type:ACTION.ADD_FACTORIAL, payload:{sign}})} 
            >{sign}</button>
        )
    } 
    
    return(
        <button className="special-sign" style={style.special_sign}
            onClick={()=>dispatch({type:ACTION.EXPONENT_BY_Y, payload:{sign}})}
        >x<sup>{sign}</sup></button>
    )
    
    
}