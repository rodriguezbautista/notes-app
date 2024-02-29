import { useNavigate } from 'react-router-dom';
import url from '../utils/apiUrl';
import React, { useState } from 'react';

interface NoteActionsProps {
	id: string;
	status: string;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NoteActions({
	id,
	status,
	setIsEditing,
}: NoteActionsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function deleteNote() {
		try {
			setIsLoading(true);
			await fetch(url + `/notes/${id}`, {
				method: 'DELETE',
				credentials: 'include',
			});
			setIsLoading(false);
			navigate(0);
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
		navigate(0);
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
			<br />
			<hr />
			<br />
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
