import React, { useState } from 'react';

interface CategoriesProps {
	categories: string[];
	edit?: boolean;
	setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Categories({
	categories,
	setCategories,
	edit = false,
}: CategoriesProps) {
	const [category, setCategory] = useState<string>('');

	function addCategory(category: string) {
		setCategories(prev => [...prev, category]);
		setCategory('');
	}

	function removeCategory(name: string) {
		setCategories(prev => prev.filter(c => c !== name));
	}

	return (
		<div className="note__categories">
			{edit && (
				<div className="categories__input">
					<input
						spellCheck={false}
						type="text"
						value={category}
						placeholder="Add categories..."
						onChange={e => {
							setCategory(e.target.value);
						}}
						onKeyDown={e => {
							if (
								e.key === 'Enter' &&
								category &&
								!categories.includes(category)
							) {
								e.preventDefault();
								addCategory(category);
							}
						}}
					/>
				</div>
			)}
			{!!categories?.length && (
				<ul className="categories__list">
					{categories.map(c => {
						return (
							<li key={c} className="category">
								{edit ? (
									<button
										className="category__btn"
										type="button"
										onClick={e => {
											removeCategory(c);
										}}
										onKeyDown={e => e.preventDefault()}>
										<img
											src="/xmark-icon.svg"
											alt="Delete category"
											className="icon action__icon"
										/>
										<span>{c}</span>
									</button>
								) : (
									<span>{c}</span>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
