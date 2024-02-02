import { useEffect, useMemo, useRef, useState } from "react";
import { TailSpin } from 'react-loader-spinner';
import { Link } from "react-router-dom";
import Note from "../components/Note";
import NoteModal from "../components/NoteModal";
import { useSession } from "../hooks/useSession";
import url from '../utils/apiUrl';

export default function NotesPage(){
  const [filteredCategory, setFilterCategories] = useState('');
  const [filteredState, setFilteredState] = useState('all')
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged] = useSession();
  const [noteList, setNoteList] = useState([]);
  const modalRef = useRef(null);

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
    .catch(() => {
      setIsLoading(false)
      setNoteList([]);
    });
  }, []);

  const categoriesList = useMemo(() => Array.from(new Set(noteList.flatMap(note => [...note.categories], []))), [noteList])
  
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
          <h1 className='header__title'>Dashboard</h1>
          <NoteFilters
            categoriesList={categoriesList}
            setFilterCategories={setFilterCategories}
            filteredState={filteredState}
            filteredCategory={filteredCategory}
            setFilteredState={setFilteredState} />
          <ul className='notes'>
            {!!noteList &&
            noteList.filter(note => filteredState==="all" || note.status === filteredState).filter(note => !filteredCategory.length || note.categories.some(category => filteredCategory.includes(category))).map(({
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
            className='primary primary-btn notes__add-btn'
            onClick={() => {
              if (modalRef.current)
                modalRef.current.showModal()
            }}>
            <img src='/add-note-icon.svg' alt='Add note icon' className='icon notes__add-btn__icon'/>
            Add Note
          </button>
          <NoteModal
            ref={modalRef} />
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
  </>
  );
}

function NoteFilters({categoriesList, filteredState, setFilteredState, filteredCategory, setFilterCategories}){
  const filtersRef = useRef(null);

  function openFilters(){
    filtersRef.current.classList.toggle('open');
  }

  function changeFilterState(e, state){
    e.preventDefault();
    setFilteredState(state);
  }
  
  function changeFilterCategories(e, category){
    e.preventDefault();
    setFilterCategories(prev => {
      if (prev === category){
        return '';
      }
      return category
    });
  }

  return(
    <>
    <button 
      className="filter__button"
      onClick={openFilters}><img className="action__icon" src="/filter-icon.svg" alt="filter icon"/></button>
    <div className="notes__header" ref={filtersRef}>
      <div className="notes__filter">
        <ul className="filter__list" style={{display: (!categoriesList.length) ? 'none': ''}}>
          {
            categoriesList.map(category => {
              return(
                <li key={category}>
                  <button 
                    onClick={(e) => changeFilterCategories(e, category)}
                    className={`filter${(filteredCategory === category) ? " active": ""}`}
                    id={category}>{category}</button>
                </li>
              )
            })
          }
        </ul>
      </div>
      <div className="notes__status">
        <button 
          onClick={(e) => changeFilterState(e, "all")}
          className={filteredState === "all" ? "active ": ""}
          id="All">All</button>
        <button 
          onClick={(e) => changeFilterState(e, "active")}
          className={filteredState === "active" ? "active ": ""}
          id="Active">Active</button>
        <button 
          onClick={(e) => changeFilterState(e, "inactive")}
          className={filteredState === "inactive" ? "active ": ""}
          id="Inactive">Inactive</button>
        <button 
          onClick={(e) => changeFilterState(e, "archived")}
          className={filteredState === "archived" ? "active ": ""}
          id="Archived">Archived</button>
      </div>
    </div>
    </>
  )
}