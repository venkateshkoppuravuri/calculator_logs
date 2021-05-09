import React, { useEffect, useState } from 'react';
import "./Calculator.css";
import { socket } from "../../socket";

// list of numbers to be displayed on to the keypad
const numbers = [{
    number: 7,
    id: "seven"
}, {
    number: 8,
    id: "eight"
}, {
    number: 9,
    id: "nine"
}, {
    number: 4,
    id: "four"
}, {
    number: 5,
    id: "five"
}, {
    number: 6,
    id: "six"
}, {
    number: 1,
    id: "one"
}, {
    number: 2,
    id: "two"
}, {
    number: 3,
    id: "three"
}, {
    number: 0,
    id: "zero"
},];

// list of operators to be displayed on to the keypad
const operations = [{
    symbol: "/",
    id: "divide"
}, {
    symbol: "*",
    id: "multiply"
}, {
    symbol: "-",
    id: "subtract"
}, {
    symbol: "+",
    id: "add"
}, {
    symbol: "=",
    id: "equals"
},];

const Calculator = ({ setLogs }) => {
    // maintaining states for results, and operators

    // to hold the current value to display
    const [currentNumber, setCurrentNumber] = useState("0");
    // to hold the operatorFlag whether true or not to perform calculation
    const [operatorFlag, setOperatorFlag] = useState(false);
    // to hold the decimalFlag whether the number contains the decimal point 
    const [decimalFlag, setDecimalFlag] = useState(false);
    // to hold the status whether the expression is calculated or not
    const [isCalculated, setIsCalculated] = useState(false);
    // to store the userId
    const [userId, setUserId] = useState("");

    // on initial render of the component to store the userId
    useEffect(() => {
        socket.on("connect", () => {
            setUserId(socket.id);
        })
    }, []);

    // onclick of any button of the calculator
    const onClickHandler = (e) => {
        const value = e.target.textContent;
        switch (true) {
            // onClick of any numbers on the keypad
            case value === "0" ||
                value === "1" ||
                value === "2" ||
                value === "3" ||
                value === "4" ||
                value === "5" ||
                value === "6" ||
                value === "7" ||
                value === "8" ||
                value === "9":
                if (!isCalculated) {
                    // checking if and only if the value is calculated
                    if (currentNumber !== "0") {
                        setCurrentNumber(currentNumber + value);
                        setOperatorFlag(false);
                    } else {
                        setCurrentNumber(value);
                    }
                } else {
                    setIsCalculated(false);
                    setCurrentNumber(value);
                }
                break;

            case value === "+" ||
                value === "-" ||
                value === "*" ||
                value === "/":
                if (!isCalculated) {
                    if (!operatorFlag) {
                        // if operator is not already clicked
                        setCurrentNumber(currentNumber + value);
                        setOperatorFlag(true);
                        setDecimalFlag(false);
                    } else {
                        // if operator is clicked already
                        const newNumber = currentNumber.slice(0, currentNumber.length - 1);
                        setCurrentNumber(newNumber + value);
                    }
                } else {
                    setIsCalculated(false);
                    if (value === "+" || value === "-") {
                        setCurrentNumber(value);
                    }
                }
                break;

            // onclick of ac, clearing all the fields
            case value === "AC":
                setCurrentNumber("0");
                setOperatorFlag(false);
                setDecimalFlag(false);
                break;


            case value === "=":
                if (isCalculated)
                    break;
                try {
                    // eslint-disable-next-line
                    let result = parseFloat(eval(currentNumber));
                    // rounding the decimals to two numbers
                    result = (Math.round(result * 100) / 100).toString();
                    const newLog = { "userId": userId, "expression": currentNumber + " = " + result };
                    setCurrentNumber(result);
                    setOperatorFlag(false);
                    setDecimalFlag(false);
                    setIsCalculated(true);
                    // emitting the socket event on equals
                    socket.emit("equals", newLog);
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        break;
                    }
                }
                break;

            case value === ".":
                if (isCalculated)
                    break;
                if (!decimalFlag) {
                    setCurrentNumber(currentNumber + ".");
                    setDecimalFlag(true);
                }
                break;

            default:
                break;
        }
    }


    return (
        <>
            <div>
                <h3>UserId: {userId}</h3>
            </div>
            <div className="calculator">
                <div className="display">
                    {currentNumber}
                </div>
                <div className="numbers-container">
                    <button className="grey bigW ac" onClick={onClickHandler}>AC</button>
                    {numbers.map((number, index) => (
                        <button key={index} id={number.id} className={`dark-grey ${number.number === 0 && 'bigW'}`} onClick={onClickHandler}>{number.number}</button>
                    ))}
                    <button className="grey" onClick={onClickHandler}>.</button>
                </div>
                <div className="operations-container">
                    {operations.map((operation, index) => (
                        <button key={index} className="orange" id={operation.id} onClick={onClickHandler}>{operation.symbol}</button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Calculator;