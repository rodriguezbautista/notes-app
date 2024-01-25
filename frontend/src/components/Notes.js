import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAutosizeTextArea from "../hooks/useAutoResize";
import url from '../utils/apiUrl';
import Categories from "./Categories";
import NoteOptions from "./NoteOptions";

export default function Note({id, content, lastModified, categories, status}){
  const [editedText, setEditedText] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);
  const navigate = useNavigate(); 
  const textAreaRef = useRef(null)

  useAutosizeTextArea(textAreaRef.current, editedText);

  async function editNote(){
    try{
      setIsLoading(true);
      const response = await fetch(url + `/notes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          content: editedText,
          categories: localCategories.map(c => {return {"category": c}})
        })
      });
      setIsLoading(false);
      if (response.ok){
        setIsEditing(false);
        navigate(0);
      }
    } catch(err){
      console.log(err);
    }
  }

  async function deleteNote(){
    try{
      setIsLoading(true);
      await fetch(url + `/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setIsLoading(false);
      navigate(0);
    } catch(err){
      console.log(err);
    }
  }

  function compareCategories(categories, localCategories){
    return categories.length === localCategories.length &&
           categories.every((c) => localCategories.includes(c))
  }

  const lastModifiedFormatted = new Date(lastModified).toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const initialDisplay = 
        <>
          <button
            className='note__action btn'
            disabled={isLoading}
            onClick={() => setIsEditing(true)}>
              <img src='/edit-icon.svg' alt='Note edit button' className='icon action__icon'/>
              Edit
          </button>
          <button 
            className='note__action btn'
            disabled={isLoading}
            onClick={async (e) => {
              await deleteNote();
            }}>
              <img src='/delete-icon.svg' alt='Note delete button' className='icon action__icon'/>
              Delete
          </button>
        </>


  const editingDisplay = 
        <>  
          <button
            className='note__action btn'

            // button is only disabled when content and category list hasnt changed
            disabled={(content === editedText && compareCategories(categories, localCategories)) || isLoading}
            onClick={async () => {
              await editNote();
            }}>
            Save
            <img src='/check-icon.svg' alt='Submit edit button' className='icon action__icon'/>
          </button>
          <button
            className='note__action btn'
            type="submit"
            onClick={() => setIsEditing(false)}>
            Cancel
            <img src='/xmark-icon.svg' alt='Submit edit button' className='icon action__icon'/>
          </button>
        </>

  return (
    <li className='note'>
      {
        !isEditing ?
        <p className='note__content'>{content}</p>
        :
        <textarea
        spellCheck={false}
        ref={textAreaRef}
        value={editedText} 
        autoFocus={true} 
        onChange={(e) => setEditedText(e.target.value)} 
        className='note__content'
        name="content"/>
      }
      <div className="note__data">
          {
            !isEditing ?
            <Categories 
            categories={categories}
            status={status}/>
            :
            <Categories 
            categories={localCategories}
            setCategories={setLocalCategories}
            status={status}
            edit={isEditing}/>
          }
        <div className='note__info'>
        <NoteOptions 
          status={status}
          id={id}/>
          <div className="note__actions">
          {
            !isEditing ?
            initialDisplay :
            editingDisplay
          }
          </div>
        <h5 className='note__created-at'>{lastModifiedFormatted}</h5>
        </div>
      </div>
    </li>
  );
}