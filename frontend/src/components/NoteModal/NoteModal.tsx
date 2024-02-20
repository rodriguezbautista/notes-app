import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import url from "../../utils/apiUrl";
import Categories from "../Categories";
import useAutosizeTextArea from "../../hooks/useAutoResize";

interface NoteModalProps {
  id: string;
  categories: string[];
  content: string;
  editing: boolean;
}

export default forwardRef(function NoteModal(
  { id, categories = [], content = "", editing = false }: NoteModalProps,
  ref
) {
  const [editedText, setEditedText] = useState(content);
  const [editedCategories, setEditedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const textAreaRef = useRef(null);
  const navigate = useNavigate();

  useAutosizeTextArea(textAreaRef.current, editedText);

  useEffect(() => {
    if (ref?.current) {
      ref.current.querySelector("form").focus();
    }
  }, [ref]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(-1, -1);
    }
  }, [textAreaRef]);

  async function editNote() {
    try {
      setIsLoading(true);
      const response = await fetch(url + `/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: editedText,
          categories: editedCategories.map((c) => {
            return { category: c };
          }),
        }),
      });
      setIsLoading(false);
      if (response.ok) {
        navigate(0);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function postNote() {
    try {
      setIsLoading(true);
      await fetch(url + "/notes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedText,
          categories: {
            create: categories.map((c) => {
              return { category: c };
            }),
          },
        }),
      });
      setIsLoading(false);
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  }

  function compareCategories(categories, localCategories) {
    return (
      categories.length === localCategories.length &&
      categories.every((c) => localCategories.includes(c))
    );
  }

  return (
    <dialog
      ref={ref}
      onBlur={(e) => {
        if (ref.current) if (e.currentTarget === e.relatedTarget) ref.current.close();
      }}
      className="modal__container"
    >
      <form tabIndex={0} className="modal__form">
        <h2>New Note</h2>
        <textarea
          spellCheck={false}
          value={editedText}
          rows={3}
          onChange={(e) => setEditedText(e.target.value)}
        />
        <div className="note__info">
          <Categories
            categories={categories}
            setCategories={setEditedCategories}
            edit={true}
            modal={true}
          />
          {!editing ? (
            <button
              className="primary"
              disabled={isLoading || !editedText}
              onClick={async () => {
                await postNote();
              }}
            >
              Create
            </button>
          ) : (
            <>
              <button
                className="note__action primary"
                // button is only disabled when content and category list hasnt changed
                disabled={
                  (content === editedText && compareCategories(categories, editedCategories)) ||
                  isLoading
                }
                onClick={async () => {
                  await editNote();
                }}
              >
                Save
                <img src="/check-icon.svg" alt="Submit edit button" className="icon action__icon" />
              </button>
              <button
                className="note__action primary"
                type="submit"
                onClick={() => {
                  setEditedText(content);
                }}
              >
                Cancel
                <img src="/xmark-icon.svg" alt="Submit edit button" className="icon action__icon" />
              </button>
            </>
          )}
        </div>
      </form>
    </dialog>
  );
});
