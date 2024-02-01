import { useRef, useState } from "react";
import Categories from "./Categories";
import NoteActions from "./NoteActions";

export default function Note({id, content, lastModified, categories, status}){
  const [actionsOpened, setActionsOpened] = useState(false);
  const optionsRef = useRef(null);

  const lastModifiedFormatted = new Date(lastModified).toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <li className='note'>
      <div className="note__header">
        <h3 className='note__created-at'>{lastModifiedFormatted}</h3>
        <button 
          className="note__actions-btn"
          onClick={() => {
            setActionsOpened(!actionsOpened);
            if (!actionsOpened && optionsRef.current){
              optionsRef.current.focus();
            }
          }
          }><img src="" alt=""/><strong>...</strong></button>
          <div 
            ref={optionsRef}
            className={`note__actions${+ actionsOpened ? " opened" : ""}`}
            tabIndex={0}
            onBlur={(e) => {
                if (e.currentTarget !== e.relatedTarget.parentElement)
                  setActionsOpened(false);
            }} >
            <NoteActions 
              status={status}
              id={id}/>
          </div>
      </div>
      <p>{content}</p>
      <Categories 
        categories={categories} />
    </li>
  );
}