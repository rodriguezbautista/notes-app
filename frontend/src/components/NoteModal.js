import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import url from "../utils/apiUrl";
import Categories from "./Categories";

export default function NoteModal({addingNote, setAddingNote}){
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (ref && ref.current){
      ref.current.querySelector('form').focus();
    }
  },[addingNote]);

  async function postNote(){
    try{
      setIsLoading(true);
      await fetch(url + '/notes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          categories: {
            create: categories.map(c => {return {"category": c}})
          }
        }),
      });
      setIsLoading(false);
      navigate(0);
    } catch(err) {
      console.log(err);
    };
  };

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
            <h2>New Note</h2>
            <textarea 
              spellCheck={false}
              value={content}
              rows={3}
              onChange={(e) => setContent(e.target.value)}
              />
            <div className="note__info">
              <Categories
                categories={categories}
                setCategories={setCategories}
                edit={true} 
                modal={true}/>
              <button 
                className="btn"
                disabled={isLoading || !content}
                onClick={async () => {
                  await postNote();
                }}>
                Create
              </button>
            </div>
        </form>
    </div>
  )
}