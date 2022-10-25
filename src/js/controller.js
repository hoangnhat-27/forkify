import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'regenerator-runtime/runtime';
import 'core-js/stable';

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0, Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //1, Loading recipe
    await model.loadRecipe(id);
    //2, Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    //1, Get search query
    const query = searchView.getQuery();
    resultsView.renderSpinner();
    if (!query) return;
    //2, Load search results
    await model.loadSearchResults(`${query}`);
    //3.Render results
    resultsView.render(model.getSearchResultsPage(1));
    //4, Render pagination buttons
    paginationView.render(model.state.search)
  } catch (error) {
    paginationView.renderError();
  }
}
const controlPagination = function (goToPage) {
  //1, Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2, Render new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  //Update secipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
}

init();