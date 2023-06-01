import { environment } from "src/environments/environment";

export const global = {
  imagePath: environment.apiBackend + '/images/',
  listTags: ['Asia', 'Europe', 'Africa', 'America', 'Oceania', 'Antarctica'],
  defaultImage: environment.apiBackend + '/images/loadings/' + 'default-image.gif'
};
