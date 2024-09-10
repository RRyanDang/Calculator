import {ACTION} from './Calculator' 



export default function DigitButton({dispatch, digit}){
    const style={
        digitButton:{
            backgroundColor: '#72572f'
        }
    }
    return( 
        <button style={style.digitButton}
            onClick={()=>dispatch({type:ACTION.ADD_DIGIT, payload:{digit}})} 
        >{digit}</button>
    )
  
}




