import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import url from "../utils/apiUrl";
import Categories from "./Categories.tsx";
import useAutosizeTextArea from "../hooks/useAutoResize";

interface NoteModalProps {
  modalRef?: React.RefObject<HTMLDialogElement>;
  editing?: boolean;
}

export default function NoteModal({ modalRef, editing = true }: NoteModalProps) {
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useAutosizeTextArea(textAreaRef.current, content);

  useEffect(() => {
    if (modalRef?.current) {
      modalRef.current.querySelector("form")?.focus();
    }
  }, [modalRef]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(-1, -1);
    }
  }, [textAreaRef]);

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
          content: content,
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

  return (
    <dialog
      ref={modalRef}
      onBlur={(e) => {
        if (e.currentTarget === e.relatedTarget) modalRef?.current?.close();
      }}
      className="modal__container"
    >
      <form tabIndex={0} className="modal__form">
        <h2>New Note</h2>
        <textarea
          spellCheck={false}
          value={content}
          rows={3}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="note__info">
          <Categories categories={categories} setCategories={setCategories} edit={true} />
          <button
            className="primary"
            disabled={isLoading || !content}
            onClick={async () => {
              await postNote();
            }}
          >
            Create
          </button>
        </div>
      </form>
    </dialog>
  );
}
