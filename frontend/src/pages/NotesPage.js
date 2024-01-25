import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import url from '../utils/apiUrl'
import Note from "../components/Notes";
import NoteModal from "../components/NoteModal";
import { TailSpin } from 'react-loader-spinner'

export default function NotesPage(){
  const [filterState, setFilterState] = useState('all')
  const [noteList, setNoteList] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged] = useSession();

  useEffect(() => {
    fetch(url + '/notes', {
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok){
        throw new Error('Not logged in');
      }
      return res.json();
    })
    .then(res => {
      setNoteList(res);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false)
      setNoteList([]);
    });
  }, [isLogged]);

  function changeFilterState(e, state){
    e.preventDefault();
    setFilterState(state);
  }
  
  return (
    <>
    <main className='app'>
      <section className='notes__container container'>
        {
          isLoading ?
            <TailSpin 
            visible={true}
            height="160"
            width="160"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{"paddingTop": "20%", "margin": "auto"}}
            wrapperClass=""/>
          :
        <>
        {
        isLogged ?
          <>
            <h1 className='notes__title'>Notes</h1>
            <div className="notes__header">
              <div className="notes__status">
                <button 
                  onClick={(e) => changeFilterState(e, "all")}
                  className={filterState === "all" ? "active ": ""}
                  id="All">All</button>
                <button 
                  onClick={(e) => changeFilterState(e, "active")}
                  className={filterState === "active" ? "active ": ""}
                  id="Active">Active</button>
                <button 
                  onClick={(e) => changeFilterState(e, "inactive")}
                  className={filterState === "inactive" ? "active ": ""}
                  id="Inactive">Unactive</button>
                <button 
                  onClick={(e) => changeFilterState(e, "archived")}
                  className={filterState === "archived" ? "active ": ""}
                  id="Archived">Archived</button>
              </div>
              <input
                spellCheck={false}
                className="notes__filter"
                type="text"
                placeholder="Add category filters!..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filterText && !filterCategories.includes(filterText)){
                    setFilterCategories(prev => [...prev, filterText])
                    setFilterText('');
                  }
                }}/>
                <ul className="filters">
                  {
                    filterCategories.map(filter => {
                      return(
                        <li key={filter} className="filer">
                          <button
                            className="filter-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              setFilterCategories(prev => prev.filter(category => category !== filter));
                            }}>
                            <span>{filter}</span>
                            <img src="/xmark-icon.svg" alt="Delete category" className="icon action__icon"/>
                          </button>
                        </li>
                      )
                    })
                  }
                </ul>
            </div>
            <ul className='notes'>
              {!!noteList &&
              noteList.filter(note => filterState==="all" || note.status === filterState).filter(note => !filterCategories.length || note.categories.some(category => filterCategories.includes(category))).map(({
                id,
                content,
                lastModified,
                categories,
                status
              }) => {
                  return <div key={id} className="note__wrapper">
                    <Note
                      id={id}
                      content={content}
                      lastModified={lastModified}
                      categories={categories}
                      setNoteList={setNoteList}
                      status={status}/>
                  </div>
              })
            }
            </ul>
            <button 
              className='btn primary-btn notes__add-btn'
              onClick={() => setAddingNote(true)}>
              <img src='/add-note-icon.svg' alt='Add note icon' className='icon notes__add-btn__icon'/>
              Add Note
            </button>
          </>
          :
          <div className="hero__wrapper">
            <h1 className="hero__header">Welcome to NoteApp <br/>
            <Link to={'/login'} className="login-link">Join us</Link> and start using the app!</h1>
          </div>
        }
        </>
      }
      </section>
    </main>
    <NoteModal
      addingNote={addingNote}
      setAddingNote={setAddingNote} />
  </>
  );
}