const Review = {
  render: (props) => {
    return `
    <div class="form-container">
      <form id="${props.formId}">
        <ul class="form-items">
        <li> <h3>${props.title}</h3></li>
          <li>
            <label for="rating">Rating</label>
            <select required name="rating" id="rating" >
              <option value="">Select</option>
              <option value="1">1 = Poor</option>
              <option value="2">2 = Fair</option>
              <option value="3">3 = Good</option>
              <option value="4">4 = Very Good</option>
              <option value="5" selected>5 = Excellent</option>
            </select>
          </li>
          <li>
            <label for="comment" >Comment</label>
            <textarea required  name="comment" id="comment" placeholder="Write your comment here..."></textarea>
          </li>
          <li>
            <button type="submit" class="primary">Submit</button>
          </li>
          ${
            props.showCancelBtn
              ? `<li>
            <button type="button" id="cancel">Cancel changes</button>
            </li>`
              : ''
          }
        </ul>
      </form>
    </div>`;
  },
};
export default Review;
