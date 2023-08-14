import $ from 'jquery';
import { updateUser, getMyOrders } from '../api';
import { getUserInfo, setUserInfo, clearUser } from '../localStorage';
import { showLoading, hideLoading, showMessage } from '../utils';

const ProfileScreen = {
  after_render: () => {
    $('#sign-out-button').on('click', () => {
      clearUser();
      document.location.hash = '/';
    });
    $('#profile-form').on('submit', async (e) => {
      e.preventDefault();
      const userData = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
      };
      if (!userData.name || !userData.email || !userData.password)
        return showMessage('one of the values are missing!');

      showLoading();

      const data = await updateUser(userData);

      hideLoading();
      if (data?.error) showMessage(data?.error);
      else {
        setUserInfo(data);
        document.location.hash = '/';
      }
    });
  },
  render: async () => {
    const { name, email } = getUserInfo();
    if (!name) {
      document.location.hash = '/';
    }
    const orders = await getMyOrders();

    return `
    <div class="content profile">
      <div class="profile-info">
      <div class="form-container">
      <form id="profile-form">
        <ul class="form-items">
          <li>
            <h1>User Profile</h1>
          </li>
          <li>
            <label for="name">Name</label>
            <input type="name" name="name" id="name" value="${name}" />
          </li>
          <li>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" value="${email}" />
          </li>
          <li>
            <label for="password">Password</label>
            <input type="password" name="password" autocomplete="password" id="password" />
          </li>
          <li>
            <button type="submit" class="primary">Update</button>
          </li>
          <li>
          <button type="button" id="sign-out-button">Sign Out</button>
        </li>        
        </ul>
      </form>
    </div>
      </div>
      <div class="profile-orders">
      <h2>Order History</h2>
        <table>
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>TOTAL PRICE</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            ${
              orders.length === 0
                ? '<tr><td colspan="6">No Order Found.</tr>'
                : orders
                    .map(
                      (order) => `
                        <tr>
                          <td>${order._id}</td>
                          <td>${order.createdAt}</td>
                          <td>$${order.totalPrice}</td>
                          <td>${order.paidAt || 'No'}</td>
                          <td>${order.deliveryAt || 'No'}</td>
                          <td><a href="/#/order/${order._id}">DETAILS</a> </td>
                        </tr>
                        `
                    )
                    .join('\n')
            }
          </tbody>
        </table>
      </div>
    </div>


    
    `;
  },
};
export default ProfileScreen;
