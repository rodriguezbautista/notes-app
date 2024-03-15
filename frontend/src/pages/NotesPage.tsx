import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import Note, { NoteProps } from '../components/Note.tsx';
import NoteModal from '../components/NoteModal.tsx';
import { useSession } from '../hooks/useSession.js';
import url from '../utils/apiUrl.js';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

export default function NotesPage() {
	const [filteredCategories, setFilterCategories] = useState<string[]>([]);
	const [filteredState, setFilteredState] = useState('all');
	const [isLoading, setIsLoading] = useState(true);
	const [isLogged] = useSession();
	const [noteList, setNoteList] = useState<NoteProps[] | []>([]);
	const modalRef = useRef<HTMLDialogElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (isLogged)
			fetch(url + '/notes', {
				credentials: 'include',
			})
				.then(res => {
					if (!res.ok) {
						throw new Error('Not logged in');
					}
					return res.json();
				})
				.then(res => {
					setNoteList(res);
					setIsLoading(false);
				})
				.catch(() => {
					setIsLoading(false);
					setNoteList([]);
				});
		else navigate('/');
	});

	const categoriesList = useMemo(
		() =>
			Array.from(new Set(noteList.flatMap(note => [...note.categories], []))),
		[noteList],
	);

	return (
		<>
			<section className="notes__container container">
				{isLoading ? (
					<TailSpin
						visible={true}
						height="160"
						width="160"
						color="#cccc75"
						ariaLabel="tail-spin-loading"
						radius="1"
						wrapperStyle={{ paddingTop: '20%', margin: 'auto' }}
						wrapperClass=""
					/>
				) : (
					<>
						<header className="notes__header__wrapper">
							<h1 className="header__title">Dashboard</h1>
							<NoteFilters
								categoriesList={categoriesList}
								filteredCategories={filteredCategories}
								setFilterCategories={setFilterCategories}
								filteredState={filteredState}
								setFilteredState={setFilteredState}
							/>
						</header>
						<section className="notes__content">
							<ResponsiveMasonry
								columnsCountBreakPoints={{ 350: 1, 768: 2, 1000: 3 }}>
								<Masonry gutter="1rem" className="masonry-wrapper">
									{!!noteList &&
										noteList
											.filter(
												note =>
													filteredState === 'all' ||
													note.status === filteredState,
											)
											.filter(
												note =>
													!filteredCategories.length ||
													note.categories.reduce(
														(qty, category) =>
															qty +
															(filteredCategories.includes(category) ? 1 : 0),
														0,
													) === filteredCategories.length,
											)
											.sort((a, b) =>
												a.status === 'active' && b.status === 'active'
													? 0
													: a.status === 'active' &&
													  (b.status === 'inactive' || b.status === 'archived')
													? -1
													: a.status === 'inactive' && b.status === 'archived'
													? -1
													: 1,
											)
											.map(
												({ id, content, lastModified, categories, status }) => {
													return (
														<div key={id} className="note__wrapper">
															<Note
																key={id}
																id={id}
																content={content}
																lastModified={lastModified}
																categories={categories}
																status={status}
																categoriesList={categoriesList}
															/>
														</div>
													);
												},
											)}
								</Masonry>
							</ResponsiveMasonry>
							<button
								className="primary notes__add-btn"
								onClick={() => {
									if (modalRef.current) modalRef.current.showModal();
								}}>
								<img
									src="/add-note-icon.svg"
									alt="Add note icon"
									className="icon notes__add-btn__icon"
								/>
								Add Note
							</button>
						</section>
						<NoteModal modalRef={modalRef} categoriesList={categoriesList} />
					</>
				)}
			</section>
		</>
	);
}

function NoteFilters({
	categoriesList,
	filteredState,
	setFilteredState,
	filteredCategories,
	setFilterCategories,
}) {
	const filtersRef = useRef<HTMLDivElement>(null);

	function openFilters() {
		filtersRef.current?.classList.toggle('open');
	}

	function changeFilterState(e, state) {
		e.preventDefault();
		setFilteredState(state);
	}

	function changeFilterCategories(e, category) {
		e.preventDefault();
		setFilterCategories(prev => {
			if (prev.includes(category)) {
				return prev.filter(c => c !== category);
			}
			return [...prev, category];
		});
	}

	return (
		<>
			<button className="filter__button" onClick={openFilters}>
				<img
					className="action__icon"
					src="/filter-icon.svg"
					alt="filter icon"
				/>
			</button>
			<div className="notes__header" ref={filtersRef}>
				<ul
					className="notes__filter"
					style={{ display: !categoriesList.length ? 'none' : '' }}>
					{categoriesList.map(category => {
						return (
							<li key={category}>
								<button
									onClick={e => changeFilterCategories(e, category)}
									className={`filter${
										filteredCategories.includes(category) ? ' active' : ''
									}`}
									id={category}>
									{category}
								</button>
							</li>
						);
					})}
				</ul>
				<div className="notes__status">
					<button
						onClick={e => changeFilterState(e, 'all')}
						className={`status__filter ${
							filteredState === 'all' ? 'active ' : ''
						}`}
						id="All">
						All
					</button>
					<button
						onClick={e => changeFilterState(e, 'active')}
						className={`status__filter ${
							filteredState === 'active' ? 'active ' : ''
						}`}
						id="Active">
						Active
					</button>
					<button
						onClick={e => changeFilterState(e, 'inactive')}
						className={`status__filter ${
							filteredState === 'inactive' ? 'active ' : ''
						}`}
						id="Inactive">
						Inactive
					</button>
					<button
						onClick={e => changeFilterState(e, 'archived')}
						className={`status__filter ${
							filteredState === 'archived' ? 'active ' : ''
						}`}
						id="Archived">
						Archived
					</button>
				</div>
			</div>
		</>
	);
}
