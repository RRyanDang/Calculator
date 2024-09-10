import {ACTION} from './Calculator' 



export default function DigitButton({dispatch, operation}){
    const style={
        sign_style:{
            backgroundColor: '#f0ce9d',
        }
    }
    return(   
        <button 
            className='sign-style' style={style.sign_style}
            onClick={()=>dispatch({type:ACTION.ADD_OPERATION, payload:{operation}})} 
            >{operation}</button>
        
    )
}




