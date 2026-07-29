import {createContentReader, type Article, type Locale} from './mdxContent';

const reader = createContentReader('gear');

export type GearArticle = Article;
export type {Locale};

export const getGearArticle = reader.get;
export const getAllGearArticles = reader.getAll;
export const getAllGearSlugs = reader.getAllSlugs;
