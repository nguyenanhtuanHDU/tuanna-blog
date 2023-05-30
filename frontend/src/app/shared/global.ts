import { environment } from "src/environments/environment";

export const global = {
  imagePath: environment.apiBackend + '/images/',
  listTags: ['Asia', 'Europe', 'Africa', 'America', 'Oceania', 'Antarctica'],
  defaultImage: 'https://www.placecage.com/1000/1000'
};
