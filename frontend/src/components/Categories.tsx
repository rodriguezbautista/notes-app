import React, { useState } from "react";

interface CategoriesProps {
  categories: string[];
  edit?: boolean;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Categories({ categories, setCategories, edit = false }: CategoriesProps) {
  const [category, setCategory] = useState<string>("");

  function addCategory(e) {
    if (e.key === "Enter" && category && !categories?.includes(category)) {
      setCategories((prev) => [...prev, category]);
      setCategory("");
    }
  }

  function removeCategory(name) {
    setCategories((prev) => prev.filter((c) => c !== name));
  }

  return (
    <>
      {edit && (
        <>
          <div>
            <input
              spellCheck={false}
              type="text"
              value={category}
              placeholder="New category..."
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                addCategory(e);
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
            />
          </div>
        </>
      )}
      {!!categories?.length && (
        <ul className="categories__list">
          {categories.map((c) => {
            return (
              <li key={c} className="category">
                {edit ? (
                  <button
                    className="category__btn"
                    onClick={(e) => {
                      e.preventDefault();
                      removeCategory(c);
                    }}
                  >
                    <span>{c}</span>
                    <img
                      src="/xmark-icon.svg"
                      alt="Delete category"
                      className="icon action__icon"
                    />
                  </button>
                ) : (
                  <span>{c}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
