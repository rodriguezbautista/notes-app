import { useNavigate } from "react-router-dom";
import url from "../utils/apiUrl";

export default function NoteOptions({id, status}){
  const navigate = useNavigate()

  async function markNote(newStatus){
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
      <div className="note__options">
        {
          status === "active" ?
          <>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                markNote("inactive")}
              }
              className="option btn">Mark note as Inactive</button>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                markNote("archived")}
              }
              className="option btn">Mark note as Archived</button>
          </>
          :
          status === "inactive" ?
          <>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                markNote("active")}
              }
              className="option btn">Mark note as Active</button>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                markNote("archived")}
              }
              className="option btn">Mark note as Archived</button>
          </>
          :
          <>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                markNote("active")}
              }
              className="option btn">Mark note as Active</button>
            <button 
              onClick={async (e) => {
                e.preventDefault();
                markNote("inactive")}
              }
              className="option btn">Mark note as Inactive</button>
          </>
        }
      </div>
  )
}