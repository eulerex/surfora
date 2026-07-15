import {createContentReader, type Article, type Locale} from './mdxContent';

const reader = createContentReader('lessons');

export type Lesson = Article;
export type {Locale};

export const getLesson = reader.get;
export const getAllLessons = reader.getAll;
export const getAllSlugs = reader.getAllSlugs;
