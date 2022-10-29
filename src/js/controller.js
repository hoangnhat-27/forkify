import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

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

    //1, Updating bookmark view
    bookmarksView.update(model.state.bookmarks);

    //2, Loading recipe
    await model.loadRecipe(id);

    //3, Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

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
    paginationView.render(model.state.search);
  } catch (error) {
    paginationView.renderError();
  }
};
const controlPagination = function (goToPage) {
  //1, Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2, Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update secipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1, Add/remove boorkmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2, Update recipe view
  recipeView.update(model.state.recipe);
  //3, Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload new reicpe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //Change id of URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`You have an error: ${err}`);
    addRecipeView.renderError(err.message);
  }
  location.reload();
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
