import View from "./View.js";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentEl = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentEl.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    _generateMarkupButton(move, direction, value) {
        const html = `
            <button data-goto="${value}" class="btn--inline pagination__btn--${move}">
                <span>Page ${value}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-${direction}"></use>
                </svg>
            </button>`;
        return html;
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        //Page 1, and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._generateMarkupButton('next', 'right', curPage + 1);
        }
        //Last page
        if (curPage === numPages && numPages > 1) {
            return this._generateMarkupButton('prev', 'left', curPage - 1);
        }
        //Other page
        if (curPage < numPages) {
            return this._generateMarkupButton('next', 'right', curPage + 1) + this._generateMarkupButton('prev', 'left', curPage - 1);
        }
        //Page 1, and there NO other pages
        return '';
    }
}
export default new PaginationView();