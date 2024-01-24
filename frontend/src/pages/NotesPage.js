import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

const url = process.env.REACT_APP_API_URL;

export default function NotesPage(){
  const [noteList, setNoteList] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [isLogged] = useSession();

  useEffect(() => {
    fetch(url + '/notes', {
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok){
        throw new Error('Not logged in')
      }
      return res.json();
    })
    .then(res => setNoteList(res))
    .catch((err) => {
      console.log(err);
      setNoteList([]);
    })
  }, [isLogged]);
  
  return (
    <main className='notes__container container'>
      {
      isLogged ?
        <>
          <div className="notes__header">
            <h1 className='notes__title'>Notes</h1>
            <button 
              className='notes__add-btn btn'
              onClick={() => setAddingNote(true)}>
              <img src='/add-note-icon.svg' alt='Add note icon' className='icon add-btn__icon'/>
              <h2 className='add-btn__description'>Add Note</h2>
            </button>
          </div>
          <ul className='notes'>
            {!!noteList && noteList.map(({
              id,
              content,
              lastModified
            }) => <Note
                    key={id}
                    id={id}
                    content={content}
                    lastModified={lastModified}
                    setNoteList={setNoteList}/>
            )}
          </ul>
          <AddNoteModal 
            addingNote={addingNote}
            setAddingNote={setAddingNote} />
        </>
        :
        <h1><Link to={'/login'} className="login-link">Login</Link> to use the app!</h1>
      }
    </main>
  );
}


function Note({id, content, lastModified, setNoteList}){
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(content)

  async function submitEdit(){
    try{
      const response = await fetch(url + `/notes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          content: editedText
        })
      });
      if (response.ok){
        setIsEditing(false);
      }
    } catch(err){
      console.log(err);
    }
  }

  async function deleteNote(){
    try{
      await fetch(url + `/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setNoteList(prev => prev.filter(note => note.id !== id))
    } catch(err){
      console.log(err);
    }
  }

  const lastModifiedFormatted = new Date(lastModified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const initialDisplay = 
        <>
          <p className='note__content'>{content}</p>
          <div className='note__info'>
            <h5 className='note__created-at'>Last modified: {lastModifiedFormatted}</h5>
            <button
              className='note__action btn'
              onClick={() => setIsEditing(true)}>
                <img src='/edit-icon.svg' alt='Note edit button' className='icon action__icon'/>
                <span className='action__description'>Edit</span>
            </button>
            <button 
              className='note__action btn'
              onClick={async () => await deleteNote()}>
                <img src='/delete-icon.svg' alt='Note delete button' className='icon action__icon'/>
                <span className='action__description'>Delete</span>
            </button>
          </div>
        </>


  const editingDisplay = 
    <form className="edit-form">
      <textarea 
        value={editedText} 
        autoFocus={true} 
        onChange={(e) => setEditedText(e.target.value)} 
        className='note__content'
        name="content"></textarea>
      <div className='note__info'>
        <h5 className='note__created-at'>Last modified: {lastModifiedFormatted}</h5>
        <button
          className='note__action btn'
          type="submit"
          disabled={content === editedText}
          onClick={async (e) => {
            e.preventDefault();
            await submitEdit();
            const lastModified = new Date();
            setNoteList((prev) => {
              return [{id, content: editedText, lastModified: lastModified.toISOString()}, ...prev.filter(note => note.id !== id)];
            });
          }}>
          <img src='/check-icon.svg' alt='Submit edit button' className='icon action__icon'/>
        </button>
        <button
          className='note__action btn'
          type="submit"
          onClick={() => setIsEditing(false)}>
          <img src='/xmark-icon.svg' alt='Submit edit button' className='icon action__icon'/>
        </button>
      </div>
    </form>

  return (
    <li>
      <div className='note'>
        {
          !isEditing ?
          initialDisplay :
          editingDisplay
        }
      </div>
    </li>
  );
}

function AddNoteModal({addingNote, setAddingNote}){
  const [content, setContent] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (ref && ref.current){
      ref.current.querySelector('form').focus();
    }
  },[addingNote]);

  async function postNote(){
    try{
      await fetch(url + '/notes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content
        }),
      });
      navigate(0)
    } catch(err) {
      console.log(err);
    }
  }

  return(
    addingNote &&
    <div 
      ref={ref}
      tabIndex={0}
      onBlur={(e) => {
        if (e.currentTarget === e.relatedTarget){
          setAddingNote(false)
        }
      }}
      className="modal__container">
        <form 
          tabIndex={0}
          className="modal__form">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}/>
            <button 
            className="btn"
            onClick={async (e) => {
              e.preventDefault()
              await postNote()
            }}>
              <h2>Create</h2>
            </button>
        </form>
    </div>
  )
}