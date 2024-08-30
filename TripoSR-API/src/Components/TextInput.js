// src/TextInput.js
import React, { useState } from 'react';

const TextInput = () => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const handleChange1 = (event) => {
        setInput1(event.target.value);
    };

    const handleChange2 = (event) => {
        setInput2(event.target.value);
    };

    return (
        <div>
            <label htmlFor="input1">Input 1:</label>
            <input
                type="text"
                id="input1"
                value={input1}
                onChange={handleChange1}
            />
            <br />
            <label htmlFor="input2">Input 2:</label>
            <input
                type="text"
                id="input2"
                value={input2}
                onChange={handleChange2}
            />
        </div>
    );
};

export default TextInput;

