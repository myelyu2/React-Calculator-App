import Wrapper from "./Wrapper"
import Screen from "./Screen"
import ButtonBox from "./ButtonBox"
import Button from "./Button"
import React, { useState } from "react";

// Value Formatting: take a number, format it into the string format and create the space separators for the thousand mark
const toLocaleString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");
const removeSpaces = (num) => num.toString().replace(/\s/g, "");

// Button Values
const btnValues = [
  ["C", "+/-", "%", "÷"],
  [7, 8, 9, "×"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];


const App = () => {
  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
  });


  // The numClickHandler function gets triggered only if any of the number buttons (0–9) are pressed. 
  // Then it gets the value of the Button and adds that to the current num value.
  // It will also make sure that:
  // - no whole numbers start with zero
  // - there are no multiple zeros before the comma
  // - the format will be “0.” if “.” is pressed first
  // - numbers are entered up to 16 integers long
  
  const numClickHandler = (e) => {
    e.preventDefault()
    const value = e.target.innerHTML;

    
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num: calc.num === 0 && value === "0" ? "0" :
             removeSpaces(calc.num) % 1 === 0 ? toLocaleString(Number(removeSpaces(calc.num + value))) :
             toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      })
    }
  }

  
  // The commaClickHandler function gets fired only if the decimal point (.) is pressed. It adds the decimal point to the current num value, making it a decimal number.
  // It will also make sure that no multiple decimal points are possible.
  
  const commaClickHandler = (e) => {
    e.preventDefault()
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  }

  
  // The signClickHandler function gets fired when the user press either +, –, * or /. The particular value is then set as a current sign value in the calc object.
  // It will also make sure that there’s no effect on repeated calls:
  
  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0,
    });
  }

  
  // The equalsClickHandler function calculates the result when the equals button (=) is pressed. 
  // The calculation is based on the current num and res value, as well as the sign selected (see the math function).
  // The returned value is then set as the new res for the further calculations.

  // It will also make sure that:
  // - there’s no effect on repeated calls
  // - users can’t divide with 0
  
  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+" ? a + b :
        sign === "-" ? a - b : 
        sign === "×" ? a * b : a / b;
  
      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "÷"
            ? "Can't divide with 0"
            : toLocaleString(math(Number(removeSpaces(calc.res)), Number(removeSpaces(calc.num)), calc.sign)),
        sign: "",
        num: 0,
      });
    }
  }

  
  // The percentClickHandler function checks if there’s any entered value (num) or calculated value (res) and then calculates 
  // the percentage using the built-in Math.pow function, which returns the base to the exponent power:
  
  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  }

  
  // The invertClickHandler function first checks if there’s any entered value (num) or calculated value (res) and then inverts them by multiplying with -1:
  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num)) * -1 : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res)) * -1 : 0,
      sign: "",
    });
  }

  
  // The resetClickHandler function defaults all the initial values of calc, returning the calc state as it was when the Calculator app was first rendered
  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  }


  return (
    <Wrapper>
      <Screen value = {calc.num ? calc.num : calc.res}/>

      <ButtonBox>
        {
          btnValues.flat().map((btn, i) => {
            return (
              <Button 
                key={i}
                // className = {btn === "=" ? "equals" : ""}
                className = {btn === "C" || btn === "+/-" || btn === "%" ? "topButtons" : 
                             btn === "=" || btn === "÷"|| btn === "×"|| btn === "-" || btn === "+" ? "rightButtons" : 
                             btn === "0" ? "zero" : "" }
                value = {btn}
                onClick = {
                  btn === "C" ? resetClickHandler :
                  btn === "+/-" ? invertClickHandler :
                  btn === "%" ? percentClickHandler :
                  btn === "=" ? equalsClickHandler :
                  btn === "÷" || btn === "×" || btn === "-" || btn === "+" ? signClickHandler :
                  btn === "." ? commaClickHandler : numClickHandler
                }
              />
            )
          })
        }
        
      </ButtonBox>
    </Wrapper>
  );
}

export default App;
