# RSS Reader

[![Actions Status](https://github.com/ilrosch/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/ilrosch/frontend-project-11/actions) [![rss](https://github.com/ilrosch/frontend-project-11/actions/workflows/rss.yml/badge.svg)](https://github.com/ilrosch/frontend-project-11/actions/workflows/rss.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/71f7f35e4e593fc6d0bc/maintainability)](https://codeclimate.com/github/ilrosch/frontend-project-11/maintainability)

RSS Reader is a service for aggregating RSS feeds, with the help of which it is convenient to read a variety of sources, such as blogs. It allows you to add an unlimited number of RSS feeds, updates them itself and adds new entries to the common stream.

**[Link to demo](https://frontend-project-11-chi-gilt.vercel.app/)**

---

## Tech Stack

- **JavaScript** : [promises (native)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), [yup](https://github.com/jquense/yup), [axios](https://github.com/axios/axios), [onChange](https://github.com/Qard/onchange), [i18next](https://www.i18next.com/)
- **Bundler** : [webpack](https://webpack.js.org/)
- **Layout** : [bootstrap 5](https://getbootstrap.com/)
- **CI/CD** : [vercel](https://vercel.com/), [codeclimate](https://codeclimate.com/), github actions

---

## Get Start

- Clone the repository to yourself locally:

```console
  git clone git@github.com:ilrosch/frontend-project-11.git
  # or
  # git clone https://github.com/ilrosch/frontend-project-11.git
```

- Install the necessary packages:

```
  npm ci
  # or
  # make install
```

- Run project locally:

```
  npx webpack serve
  # or
  # make dev
```
