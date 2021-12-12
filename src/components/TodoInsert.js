import React from 'react';
import { MdAdd } from "react-icons/md";
//import './TodoInsert.css';

const TodoInsert = () => {
  return (
    <form className="TodoInsert">
      <input placeholder="할 일을 입력하세요" />
      <button type="submit">
        <MdAdd/>
      </button>
    </form>
  );
};

export default TodoInsert;