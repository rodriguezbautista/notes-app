import { useNavigate } from "react-router-dom";
import url from "../utils/apiUrl";
import { useState } from "react";

export default function NoteActions({id, status}){
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

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

  async function newStatus(newStatus){
    await fetch(url + `/notes/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus
      })
    });
    navigate(0);
  }
  
  return (
    <>
      {
        status === "active" ?
        <>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              newStatus("inactive")}
            }
            className="note__action secondary">Mark note as Inactive</button>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              newStatus("archived")}
            }
            className="note__action secondary">Mark note as Archived</button>
        </>
        :
        status === "inactive" ?
        <>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              newStatus("active")}
            }
            className="note__action secondary">Mark note as Active</button>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              newStatus("archived")}
            }
            className="note__action secondary">Mark note as Archived</button>
        </>
        :
        <>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              newStatus("active")}
            }
            className="note__action secondary">Mark note as Active</button>
          <button 
            onClick={async (e) => {
              e.preventDefault();
              newStatus("inactive")}
            }
            className="note__action secondary">Mark note as Inactive</button>
        </>
      }
      <button
        className='note__action secondary'
        disabled={isLoading}
        onClick={() => {}}>
          <span>Edit</span>
          <img src='/edit-icon.svg' alt='Note edit button' className='action__icon'/>
      </button>
      <button 
        className='note__action secondary'
        disabled={isLoading}
        onClick={async (e) => {
          await deleteNote();
        }}>
          <span>Delete</span>
          <img src='/delete-icon.svg' alt='Note delete button' className='action__icon'/>
      </button>
    </>
  )
}