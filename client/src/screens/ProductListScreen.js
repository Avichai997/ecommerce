import $ from 'jquery';
import DashboardMenu from '../components/DashboardMenu';
import { getProducts, createProduct, deleteProduct } from '../api';
import { showLoading, hideLoading, rerender, showMessage } from '../utils';
import { getUserInfo } from '../localStorage';

const ProductListScreen = {
  after_render: () => {
    $('#create-product-button').on('click', async () => {
      const data = await createProduct({
        name: 'sample product',
        description: 'sample desc',
        category: 'sample category',
        brand: 'sample brand',
        image: '/uploads/product-1.jpg',
      });
      document.location.hash = `/product/${data._id}/edit`;
    });

    $('.edit-button').on('click', function () {
      document.location.hash = `/product/${this.id}/edit`;
    });

    $('.delete-button').on('click', async function () {
      if (confirm('Are you sure to delete this product?')) {
        showLoading();
        const data = await deleteProduct(this.id);
        if (data?.error) showMessage(data?.error);
        else rerender(ProductListScreen);

        hideLoading();
      }
    });
  },
  render: async () => {
    const { isAdmin } = getUserInfo();
    const products = await getProducts();

    return `
    <div class="dashboard">
    ${DashboardMenu.render({ selected: 'products' })}
    <div class="dashboard-content">
      <h1>Products</h1>

      ${isAdmin ? '<button id="create-product-button" class="primary">Create Product</button>' : ''}
      
      <div class="product-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>IN STOCK</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              ${isAdmin ? "<th class='tr-action'>ACTION</th>" : ''}
            <tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) =>
                  `<tr>
                    <td>${product._id}</td>
                    <td>${product.name}</td>
                    <td>${product.countInStock}</td>
                    <td>${product.price}</td>
                    <td>${product.category}</td>
                    <td>${product.brand}</td>
                    ${
                      isAdmin
                        ? `<td>
                          <button id='${product._id}' class='edit-button'>
                            Edit
                          </button>
                          <button id='${product._id}' class='delete-button'>
                            Delete
                          </button>
                        </td>`
                        : ''
                    }
                  </tr>`
              )
              .join('\n')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
    `;
  },
};
export default ProductListScreen;
