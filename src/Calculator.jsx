import { useReducer } from 'react'
import "./Calculator.css"
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import SpecialButton from './SpecialButton'
import "bootstrap-icons/font/bootstrap-icons.css" //this is to use boostrap icons in React

let number_of_PI = 0
let number_of_E = 0

export const ACTION = {
  ADD_DIGIT: 'add-digit',
  ADD_CONSTANT: 'add-constant',
  ADD_OPERATION: 'add-operation',
  REMOVE_DIGIT: 'remove-digit',
  ADD_FACTORIAL: 'add-factorial',
  EXPONENT_BY_2: 'exponent-by-2',
  EXPONENT_BY_Y: 'exponent-by-y',
  CALCULATE_LOG: 'calculate-log',
  CLEAR: 'clear',
  EVALUATE: 'evaluate'
}

function evaluate({pre_ope, cur_ope, ope, special_sign, pre_special_sign, constant}){
  let result = 0
  let pre_num = parseFloat(pre_ope)
  let cur_num = parseFloat(cur_ope)

  //TACKLE ANY SPECIAL-OPERATION CALCULATION
  if (pre_special_sign!=null){
    if (pre_special_sign==='!'){
      pre_num = parseFloat(calculateFactorial(pre_num))
    } else{
      pre_num = parseFloat(calculateExponent(pre_num,pre_special_sign))
    }
  }
  if (special_sign!=null){
    if (special_sign==='!'){
      cur_num = parseFloat(calculateFactorial(cur_num))
    } else{
      cur_num = parseFloat(calculateExponent(cur_num,special_sign))
    }
  }

  switch(ope){
    case "+":
      result = pre_num + cur_num
      return result.toString()
      
    case "-":
      result = pre_num - cur_num
      return result.toString()
      
    case "x":
      result = pre_num * cur_num
      return result.toString()
      
    case "÷":
      result = pre_num / cur_num
      return result.toString()
  }
}

function calculateFactorial(cur_operation){
  let number = parseFloat(cur_operation)
  let result = 1
  while (number > 1){
    result = result*number
    number-=1
  }
  return result.toString()
}

function calculateExponent(cur_operation, amoOfTime){
  let result = 1
  cur_operation = parseFloat(cur_operation)
  amoOfTime = parseInt(amoOfTime)

  while (amoOfTime > 0){
    result *= cur_operation
    amoOfTime -= 1
  }
 
  return result.toString()
}

function calculateConstant(cur_ope){
  let number = 1
  if(number_of_E > 0){
    while (number_of_E > 0){
      number *= Math.E
      number_of_E-=1
    }
  }
  if(number_of_PI > 0){
    while(number_of_PI > 0){
      number *= Math.PI
      number_of_PI-=1
    }
  }
  if(cur_ope!=null){
    cur_ope = parseFloat(cur_ope)
    number *= cur_ope
  }
  return number.toString()
}

function reducer(state, {type, payload}) {
  switch(type){
    case ACTION.ADD_DIGIT:
      if (payload.digit==='0' && state.cur_ope==='0') {return state}
      if (payload.digit==='.' && state.cur_ope.includes('.')){return state}
      if (payload.digit==='!' && state.cur_ope.includes('!')){return state}
      
      if (state.special_sign!=null && state.special_sign!='!'){
        return{
          ...state,
          special_sign: `${payload.digit}`
        }
      }
      return {
        ...state,
        cur_ope:`${state.cur_ope || ""}${payload.digit}`
      }
    
    case ACTION.ADD_CONSTANT:
      switch(payload.constant){
        case 'e':
          number_of_E+=1
          return{
            ...state,
            constant:  `${state.constant || ""}e`
          }
        case 'π':
          number_of_PI+=1
          return{
          ...state,
          constant: `${state.constant || ""}π`
        }
      }
      return state


    case ACTION.ADD_OPERATION:
      if (state.pre_ope==null && state.cur_ope==null){
          return state
        }
      if (state.pre_ope==null){
        return{
          ...state,
          pre_ope: state.cur_ope,
          pre_special_sign: state.special_sign,
          ope: payload.operation,
          cur_ope: null,
          special_sign: null
        }
      }
      if (state.cur_ope==null){
        return{
          ...state,
          ope: payload.operation
        }
      }
      return {
        ...state,
        pre_ope: evaluate(state),
        pre_special_sign: null,
        ope: payload.operation, 
        cur_ope: null,
        special_sign: null
      }
    
    case ACTION.ADD_FACTORIAL:
      if (state.cur_ope!=null){
        return{
          ...state,
          special_sign: `${payload.sign}`
        }
      }
      return state


    case ACTION.EXPONENT_BY_Y:
      return{
        ...state,
        special_sign: <sup><i className="bi bi-square" id="square"></i></sup>
      }
      
    case ACTION.EXPONENT_BY_2:
      if (state.cur_ope==null){
        return state
      }

      if (state.special_sign==null) {
        return{
          ...state,
          pre_ope: state.pre_ope,
          cur_ope: calculateExponent(state.cur_ope,2),
          ope: state.ope,
          special_sign: null
        }
      } else{
        return{
          ...state,
          pre_ope:state.pre_ope,
          cur_ope: calculateExponent(calculateFactorial(state.cur_ope),2),
          ope: state.ope,
          special_sign: null
        }
      }
    
    case ACTION.CALCULATE_LOG:
      if(state.cur_ope==null){return state}

      let number = state.cur_ope
      if(state.constant!=null){
        number *= calculateConstant() 
      }
      if(state.special_sign!=null){
        if(state.special_sign==='!'){
          number = calculateFactorial(number)
        }else{
          number = calculateExponent(number,state.special_sign)
        }  
      }
      number = Math.log10(number).toString()
      return{
        ...state,
        cur_ope: number,
        special_sign: null,
        constant: null
      }
    case ACTION.CLEAR:
      number_of_E = 0
      number_of_PI = 0
      return {}

    case ACTION.REMOVE_DIGIT:
      if (state.special_sign!=null){
        if(state.constant==='e'){
          number_of_E-=1
        }else{
          number_of_PI-=1
        }
        return{
          ...state,
          special_sign: null
        }
      }
      if(state.constant!=null){
        const new_constant = state.constant.slice(0,-1)
        return{
          ...state,
          constant: new_constant
        }
      }
      if(state.cur_ope!=null){
        const new_number = state.cur_ope.slice(0,-1)
        return{
          ...state,
          cur_ope: new_number
        }
      }
      return state


    case ACTION.EVALUATE:
      if(state.constant!=null){
        if(state.cur_ope!=null){
          if(state.special_sign!=null){
            return{
              ...state,
              cur_ope: 'ERROR',
              constant: null,
              special_sign: null
            }
          }else{
            return{
              ...state,
              cur_ope: calculateConstant(state.cur_ope),
              constant: null
            }
          }
        }else{
          return{
          ...state,
            cur_ope: calculateConstant(null),
            constant: null
          }
        }
      }
      
      if (state.pre_ope!=null && state.cur_ope!=null){
        return{
          ...state,
          pre_special_sign: null,
          pre_ope: null,
          ope:null,
          cur_ope: evaluate(state),
          special_sign: null
        }
      }
      if (state.cur_ope!=null && state.special_sign!=null){
        if (state.special_sign==='!'){
          return{
            ...state,
            cur_ope: calculateFactorial(state.cur_ope),
            special_sign: null
          }
        }
        return{
          ...state,
          cur_ope: calculateExponent(state.cur_ope,state.special_sign),
          special_sign: null
        }
        
      }
      return state
  }
}

//FUNCTION HANDLES THE RETURN OF WHETHER EXPONENT OR NOT  
function Operation_CUR({cur_ope,special_sign,constant}){
  if(special_sign==null || isNaN(special_sign)){
    return <div className='cur-output'>{cur_ope}{constant}{special_sign}</div>
  }
  return <div className='cur-output'>{cur_ope}{constant}<sup>{special_sign}</sup></div>
}
function Operation_PRE({pre_ope, pre_special_sign, ope}){
  if(pre_special_sign!=null && pre_special_sign!='!'){
    return <div className='pre-output'>{pre_ope}<sup>{pre_special_sign}</sup> {ope}</div>
  }
  return <div className='pre-output'>{pre_ope}{pre_special_sign} {ope}</div>
}
function ConstantButton({dispatch, constant}){
  return <button className='other-button-style' 
                 onClick={()=>dispatch({type:ACTION.ADD_CONSTANT, payload:{constant}})}
         >{constant}</button>
}


export default function Calculator() {
  const [{pre_ope, pre_special_sign, ope, cur_ope, special_sign, constant}, dispatch] = useReducer(reducer,{})
  
  return (
    <>
      <div className='grid-structure'>
        <div className='output'>
          <Operation_PRE pre_ope={pre_ope} pre_special_sign={pre_special_sign} ope={ope}/>
          <Operation_CUR cur_ope={cur_ope} special_sign={special_sign} constant={constant} />
        </div>
      
        <button className='other-button-style'
                onClick={()=>dispatch({type:ACTION.EXPONENT_BY_2})}
        >x<sup>2</sup></button>
        <SpecialButton sign="!" dispatch={dispatch} />
        <button className='other-button-style'
                onClick={()=>dispatch({type:ACTION.CLEAR})}
        >AC</button>
        <button className='other-button-style'
                onClick={()=>dispatch({type:ACTION.REMOVE_DIGIT})}
        >DEL</button>
        <OperationButton operation="+" dispatch={dispatch}/>

        <SpecialButton dispatch={dispatch} sign="y"/>
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch}/>
        <DigitButton digit="3" dispatch={dispatch}/>
        <OperationButton operation="-" dispatch={dispatch}/>

        <button className='other-button-style'
                onClick={()=>dispatch({type:ACTION.CALCULATE_LOG})}
        >log</button>
        <DigitButton digit="4" dispatch={dispatch}/>
        <DigitButton digit="5" dispatch={dispatch}/>
        <DigitButton digit="6" dispatch={dispatch}/>
        <OperationButton operation="x" dispatch={dispatch}/>

        <ConstantButton dispatch={dispatch} constant='e' />
        <DigitButton digit="7" dispatch={dispatch}/>
        <DigitButton digit="8" dispatch={dispatch}/>
        <DigitButton digit="9" dispatch={dispatch}/>
        <OperationButton operation="÷" dispatch={dispatch}/>

        <ConstantButton dispatch={dispatch} constant='π' />
        <DigitButton digit="0" dispatch={dispatch}/>
        <DigitButton digit="." dispatch={dispatch}/>
        <button className='equal-sign'
                onClick={()=>dispatch({type:ACTION.EVALUATE})}
        >=</button>
        
      </div>
    </>
  )
}


