import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url from '../utils/apiUrl';
import Categories from './Categories.tsx';
import useAutosizeTextArea from '../hooks/useAutoResize.ts';

interface NoteModalProps {
	modalRef?: React.RefObject<HTMLDialogElement>;
	editing?: boolean;
	categoriesList: string[];
}

export default function NoteModal({
	modalRef,
	editing = true,
	categoriesList,
}: NoteModalProps) {
	const [content, setContent] = useState('');
	const [categories, setCategories] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const navigate = useNavigate();

	useAutosizeTextArea(textAreaRef.current, content);

	useEffect(() => {
		if (modalRef?.current) {
			modalRef.current.querySelector('form')?.focus();
		}
	}, [modalRef]);

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.focus();
			textAreaRef.current.setSelectionRange(-1, -1);
		}
	}, [textAreaRef]);

	// auto resize the textarea based on content
	useEffect(() => {
		window.addEventListener('resize', () => {
			if (textAreaRef.current) {
				textAreaRef.current.style.height = `auto`;
				textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
			}
		});
		if (textAreaRef.current) {
			textAreaRef.current.style.height = `auto`;
			textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
		}
	}, [content]);

	async function postNote() {
		try {
			setIsLoading(true);
			await fetch(url + '/notes', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content,
					categories,
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
			onBlur={e => {
				if (e.currentTarget === e.relatedTarget) modalRef?.current?.close();
			}}
			className="modal__container">
			<form
				tabIndex={0}
				className="modal__form"
				onSubmit={e => e.preventDefault()}>
				<h2>New Note</h2>
				<div className="modal__content__wrapper">
					<textarea
						placeholder="Your note here..."
						className="modal__content"
						ref={textAreaRef}
						style={{ paddingBlock: 0 }}
						spellCheck={false}
						value={content}
						rows={1}
						onChange={e => setContent(e.target.value)}
					/>
				</div>
				<div className="note__info">
					<Categories
						categories={categories}
						setCategories={setCategories}
						edit={true}
					/>
					<button
						className="primary note__create-btn"
						disabled={isLoading || !content}
						type="button"
						onClick={async e => {
							e.preventDefault();
							await postNote();
						}}>
						Create
					</button>
				</div>
			</form>
		</dialog>
	);
}
