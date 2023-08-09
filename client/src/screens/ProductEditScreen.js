import $ from 'jquery';
import { parseRequestUrl, showLoading, showMessage, hideLoading, protectRoute } from '../utils';
import { getProduct, updateProduct, uploadProductImage } from '../api';

const ProductEditScreen = {
  protect: () => protectRoute(),
  after_render: () => {
    const request = parseRequestUrl();
    $('#edit-product-form').on('submit', async (e) => {
      e.preventDefault();
      showLoading();

      const data = await updateProduct({
        _id: request.id,
        name: $('#name').val(),
        price: $('#price').val(),
        image: $('#image').val(),
        brand: $('#brand').val(),
        category: $('#category').val(),
        countInStock: $('#countInStock').val(),
        description: $('#description').val(),
      });

      hideLoading();
      if (data?.error) {
        showMessage(data?.error);
      } else {
        document.location.hash = '/productlist';
      }
    });

    $('#image-file').on('change', async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      showLoading();
      const data = await uploadProductImage(formData);
      hideLoading();
      if (data?.error) {
        showMessage(data?.error);
      } else {
        showMessage('Image uploaded successfully.');
        $('#image').val(data.image);
      }
    });
  },
  render: async () => {
    const request = parseRequestUrl();
    const product = await getProduct(request.id);

    return `
    <div class="content">
      <div>
        <a href="/#/productlist">Back to products</a>
      </div>
      <div class="form-container">
        <form id="edit-product-form">
          <ul class="form-items">
            <li>
              <h1>Edit Product ${product._id}</h1>
            </li>
            <li>
              <label for="name">Name</label>
              <input type="text" name="name" value="${product.name}" id="name" />
            </li>
            <li>
              <label for="price">Price</label>
              <input type="number" name="price" value="${product.price}" id="price" />
            </li>
            <li>
              <label for="image">Image (680 x 830)</label>
              <input type="text" name="image" value="${product.image}" id="image" />
              <input type="file" name="image-file" id="image-file" />
            </li>
            <li>
              <label for="brand">Brand</label>
              <input type="text" name="brand" value="${product.brand}" id="brand" />
            </li>
            <li>
              <label for="countInStock">Count In Stock</label>
              <input type="number" name="countInStock" value="${product.countInStock}" id="countInStock" min="0"   />
            </li>
            <li>
              <label for="category">Category</label>
              <input type="text" name="category" value="${product.category}" id="category" />
            </li>
            <li>
              <label for="description">Description</label>
              <input type="text" name="description" value="${product.description}" id="description" />
            </li>
            <li>
              <button type="submit" class="primary">Update</button>
            </li>
          </ul>
        </form>
      </div>
    </div>
    `;
  },
};
export default ProductEditScreen;
