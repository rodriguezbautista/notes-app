import React, { useEffect, useRef, useState } from 'react';
import Categories from './Categories.tsx';
import NoteActions from './NoteActions.tsx';
import url from '../utils/apiUrl.js';

export interface NoteProps {
	id: string;
	content: string;
	lastModified: string;
	categories: string[];
	status: string;
	categoriesList: string[];
}

export default function Note({
	id,
	content,
	lastModified,
	categories,
	status,
	categoriesList,
}: NoteProps) {
	const [actionsOpened, setActionsOpened] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLarge, setIsLarge] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [localeContent, setLocaleContent] = useState(content);
	const [localeCategories, setLocaleCategories] = useState(categories);
	const optionsRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLParagraphElement>(null);
	const editingContentRef = useRef<HTMLTextAreaElement>(null);

	const lastModifiedFormatted = new Date(lastModified).toLocaleDateString(
		'en-US',
		{
			year: '2-digit',
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		},
	);

	// tag note as large depending on content height
	useEffect(() => {
		if (
			contentRef.current?.offsetHeight &&
			contentRef.current?.offsetHeight > 300
		)
			setIsLarge(true);
	}, []);

	// Handle the note content height
	useEffect(() => {
		if (!isEditing) {
			if (contentRef.current?.parentElement) {
				if (isExpanded) {
					window.addEventListener('resize', () => {
						if (contentRef.current?.parentElement) {
							contentRef.current.parentElement.style.maxHeight =
								String(contentRef.current?.offsetHeight + 64) + 'px';
						}
					});
					if (contentRef.current?.parentElement) {
						contentRef.current.parentElement.style.maxHeight =
							String(contentRef.current?.offsetHeight + 64) + 'px';
					}
				} else contentRef.current.parentElement.style.maxHeight = '350px';
			}
		} else {
			if (editingContentRef.current?.parentElement) {
				editingContentRef.current.parentElement.style.maxHeight = '350px';
			}
		}
	}, [isExpanded, isEditing]);

	// after opening the note actions, any click outside will close it
	useEffect(() => {
		if (actionsOpened) {
			optionsRef.current?.focus();
		}
	}, [actionsOpened]);

	// auto resize the textarea based on content
	useEffect(() => {
		window.addEventListener('resize', () => {
			if (editingContentRef.current) {
				editingContentRef.current.style.height = `auto`;
				editingContentRef.current.style.height = `${editingContentRef.current.scrollHeight}px`;
			}
		});
		if (editingContentRef.current) {
			editingContentRef.current.style.height = `auto`;
			editingContentRef.current.style.height = `${editingContentRef.current.scrollHeight}px`;
		}
	}, [isEditing, localeContent]);

	async function editNote() {
		try {
			setIsLoading(true);
			const response = await fetch(url + `/notes/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					content: localeContent !== content ? localeContent : null,
					categories: !compareCategories(categories, localeCategories)
						? localeCategories
						: null,
				}),
			});
			setIsLoading(false);
			if (response.ok) {
			}
		} catch (err) {
			console.log(err);
		}
	}

	function compareCategories(categories, localCategories) {
		return (
			categories.length === localCategories.length &&
			categories.every(c => localCategories.includes(c))
		);
	}

	return (
		<li className="note">
			<div className="note__header">
				<span className="note__created-at">{lastModifiedFormatted}</span>
				<button
					className="actions__modal-btn"
					onClick={() => {
						setActionsOpened(!actionsOpened);
					}}>
					<img src="" alt="" />
					•••
				</button>
				<div
					ref={optionsRef}
					className={`actions__modal${actionsOpened ? ' opened' : ''}`}
					tabIndex={0}
					style={{ visibility: actionsOpened ? 'visible' : 'hidden' }}
					onBlur={e => {
						if (
							e.currentTarget !== e.relatedTarget &&
							e.currentTarget !== e.relatedTarget?.parentElement
						) {
							setActionsOpened(false);
						}
						e.relatedTarget?.addEventListener('onclick', () => {
							setActionsOpened(false);
						});
					}}>
					<NoteActions status={status} id={id} setIsEditing={setIsEditing} />
				</div>
			</div>

			<div
				className={`note__content__wrapper${
					isLarge ? (isExpanded ? ' expanded' : ' contracted') : ''
				}${isEditing ? ' editing' : ''}`}>
				{isEditing ? (
					<textarea
						ref={editingContentRef}
						value={localeContent}
						className={`note__content`}
						rows={1}
						autoCorrect="off"
						spellCheck="false"
						onChange={e => {
							setLocaleContent(e.currentTarget.value);
						}}
					/>
				) : (
					<>
						<p ref={contentRef} className={`note__content`}>
							{content}
						</p>
					</>
				)}
			</div>
			{isLarge && !isEditing ? (
				isExpanded ? (
					<button
						className="note__read-more"
						onClick={() => setIsExpanded(!isExpanded)}>
						Read Less...
					</button>
				) : (
					<button
						className="note__read-more"
						onClick={() => setIsExpanded(!isExpanded)}>
						Read More...
					</button>
				)
			) : (
				<></>
			)}

			{!!categories.length && (
				<Categories
					edit={isEditing}
					categories={localeCategories}
					setCategories={setLocaleCategories}
				/>
			)}

			{isEditing && (
				<div className="note__edit-actions">
					<button
						className="note__edit-action save"
						// button is only disabled when content and category list hasnt changed
						disabled={
							(content === localeContent &&
								compareCategories(categories, localeCategories)) ||
							isLoading
						}
						onClick={async () => {
							setIsEditing(false);
							await editNote();
						}}>
						<img
							src="/check-icon.svg"
							alt="Submit edit button"
							className="icon action__icon"
						/>
						Save
					</button>
					<button
						className="note__edit-action cancel"
						disabled={isLoading}
						onClick={() => {
							setLocaleContent(content);
							setIsEditing(false);
						}}>
						<img
							src="/xmark-icon.svg"
							alt="Submit edit button"
							className="icon action__icon"
						/>
						Cancel
					</button>
				</div>
			)}
		</li>
	);
}
