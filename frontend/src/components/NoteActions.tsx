import { useNavigate } from 'react-router-dom';
import url from '../utils/apiUrl';
import React, { useState } from 'react';
import { NoteProps } from './Note';

interface NoteActionsProps {
	id: string;
	status: string;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setNoteList: React.Dispatch<React.SetStateAction<[] | NoteProps[]>>;
}

export default function NoteActions({
	id,
	status,
	setIsEditing,
	setNoteList,
}: NoteActionsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	function deleteNote() {
		try {
			setIsLoading(true);
			setNoteList(prev => prev.filter(note => note.id !== id));
			fetch(url + `/notes/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});
			setIsLoading(false);
		} catch (err) {
			console.log(err);
		}
	}

	async function newStatus(newStatus) {
		await fetch(url + `/notes/${id}`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				status: newStatus,
			}),
		});
		setNoteList(prev =>
			prev.map(note =>
				note.id === id ? { ...note, status: newStatus } : note,
			),
		);
	}

	return (
		<>
			{status === 'active' ? (
				<>
					<button
						onClick={async () => {
							newStatus('inactive');
						}}
						className="note__action">
						Mark note as Inactive
					</button>
					<button
						onClick={async () => {
							newStatus('archived');
						}}
						className="note__action">
						Mark note as Archived
					</button>
				</>
			) : status === 'inactive' ? (
				<>
					<button
						onClick={async () => {
							newStatus('active');
						}}
						className="note__action">
						Mark note as Active
					</button>
					<button
						onClick={async () => {
							newStatus('archived');
						}}
						className="note__action">
						Mark note as Archived
					</button>
				</>
			) : (
				<>
					<button
						onClick={async () => {
							newStatus('active');
						}}
						className="note__action">
						Mark note as Active
					</button>
					<button
						onClick={async () => {
							newStatus('inactive');
						}}
						className="note__action">
						Mark note as Inactive
					</button>
				</>
			)}
			<hr />
			<button
				className="note__action"
				disabled={isLoading}
				onClick={() => {
					setIsEditing(true);
				}}>
				<img
					src="/edit-icon.svg"
					alt="Note edit button"
					className="action__icon"
				/>
				<span>Edit</span>
			</button>
			<button
				className="note__action"
				disabled={isLoading}
				onClick={async () => {
					await deleteNote();
				}}>
				<img
					src="/delete-icon.svg"
					alt="Note delete button"
					className="action__icon"
				/>
				<span>Delete</span>
			</button>
		</>
	);
}
