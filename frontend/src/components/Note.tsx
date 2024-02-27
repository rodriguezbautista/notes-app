import React, { useEffect, useRef, useState } from "react";
import Categories from "./Categories.tsx";
import NoteActions from "./NoteActions.tsx";
import { useNavigate } from "react-router-dom";
import url from "../utils/apiUrl.js";

export interface NoteProps {
  id: string;
  content: string;
  lastModified: string;
  categories: string[];
  status: string;
}

export default function Note({ id, content, lastModified, categories, status }: NoteProps) {
  const [actionsOpened, setActionsOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [isReadingMore, setIsReadingMore] = useState(false);
  const [localeContent, setLocaleContent] = useState(content);
  const [localeCategories, setLocaleCategories] = useState(categories);
  const navigate = useNavigate();
  const optionsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);

  const lastModifiedFormatted = new Date(lastModified).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          content: localeContent,
          categories: localeCategories.map((c) => {
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

  function compareCategories(categories, localCategories) {
    return (
      categories.length === localCategories.length &&
      categories.every((c) => localCategories.includes(c))
    );
  }

  useEffect(() => {
    if (contentRef.current?.offsetHeight && contentRef.current?.offsetHeight > 300)
      setIsLarge(true);
  }, []);

  return (
    <li className="note">
      <div className="note__header">
        <span className="note__created-at">{lastModifiedFormatted}</span>
        <button
          className="note__actions-btn"
          onClick={() => {
            setActionsOpened(!actionsOpened);
            if (actionsOpened && optionsRef.current) {
              optionsRef.current.focus();
            }
          }}
        >
          <img src="" alt="" />
          •••
        </button>
        <div
          ref={optionsRef}
          className={`note__actions${+actionsOpened ? " opened" : ""}`}
          tabIndex={0}
          style={{ visibility: actionsOpened ? "visible" : "hidden" }}
          onBlur={(e) => {
            if (e.currentTarget !== e.relatedTarget?.parentElement) setActionsOpened(false);
          }}
        >
          <NoteActions status={status} id={id} setIsEditing={setIsEditing} />
        </div>
      </div>
      <div
        className={`note__content__wrapper${
          isLarge ? (isReadingMore ? " expanded" : " contracted") : ""
        }`}
      >
        <p ref={contentRef} className={`note__content`}>
          {content}
        </p>
      </div>
      {!isLarge ? (
        <></>
      ) : isReadingMore ? (
        <button className="note__read-more" onClick={() => setIsReadingMore(!isReadingMore)}>
          Read Less...
        </button>
      ) : (
        <button className="note__read-more" onClick={() => setIsReadingMore(!isReadingMore)}>
          Read More...
        </button>
      )}
      {!!categories.length && (
        <Categories categories={categories} setCategories={setLocaleCategories} />
      )}
      {isEditing && (
        <>
          <button
            className="note__action primary"
            // button is only disabled when content and category list hasnt changed
            disabled={
              (content === localeContent && compareCategories(categories, localeCategories)) ||
              isLoading
            }
            onClick={async () => {
              setLocaleContent(content);
              setIsEditing(false);
              await editNote();
            }}
          >
            Save
            <img src="/check-icon.svg" alt="Submit edit button" className="icon action__icon" />
          </button>
          <button
            className="note__action primary"
            disabled={isLoading}
            onClick={() => {
              setLocaleContent(content);
              setIsEditing(false);
            }}
          >
            Cancel
            <img src="/xmark-icon.svg" alt="Submit edit button" className="icon action__icon" />
          </button>
        </>
      )}
    </li>
  );
}
