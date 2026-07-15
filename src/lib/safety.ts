import {createContentReader, type Article, type Locale} from './mdxContent';

const reader = createContentReader('safety');

export type SafetyArticle = Article;
export type {Locale};

export const getSafetyArticle = reader.get;
export const getAllSafetyArticles = reader.getAll;
export const getAllSafetySlugs = reader.getAllSlugs;
