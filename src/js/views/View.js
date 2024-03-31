export default class View {
  _data;

  /**
   * Render thr received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Andrew Pavlyuk
   * @todo Finish implementing
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data; // render() method then takes that data and store it inside of this._data
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); // this method will then convert that string into real DOM Node objects.
    // So basically newDOM will become like a big object, which is like a virtual DOM. So a DOM that is not really living on the page but which lives in our memory.

    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    // console.log(curElements);
    // console.log(newElements);

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));
      // Updates changed TEXT
      // this method compare content, the condition that we created here makes it so that this code is only executed on elements that contain text directly.
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        // console.log("😳", newEl.firstChild.nodeValue);
        // console.log("🤡", newEl.firstChild.nodeValue.trim()); // Example firstChild.nodeValue is 5, in all other elements, which do not contain text directly, this nodeValue will be null
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    // this method will be usable for all views
    this._parentElement.innerHTML = "";
  }

  renderSpinner() {
    const markup = `
           <div class="spinner">
              <svg>
                <use href="/img/icons.svg#icon-loader"></use>
              </svg>
           </div>
    `;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="/img/icons.svg#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="recipe">
        <div class="message">
          <div>
            <svg>
              <use href="/img/icons.svg#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
