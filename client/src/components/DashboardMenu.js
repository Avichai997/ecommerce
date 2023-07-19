import { getUserInfo } from '../localStorage';

const DashboardMenu = {
  render: (props) => {
    const { isAdmin } = getUserInfo();

    return `
    <div class="dashboard-menu">
      <ul>
      ${
        isAdmin
          ? `<li class="${props.selected === 'dashboard' ? 'selected' : ''}">
        <a href="/#/dashboard">Dashboard</a>
        </li>
        <li class="${props.selected === 'orders' ? 'selected' : ''}">
        <a href="/#/orderlist">Orders</a>
        </li>`
          : ''
      }
        <li class="${props.selected === 'products' ? 'selected' : ''}">
          <a href="/#/productlist">Products</a>
        </li>
      </ul>
    </div>
    `;
  },
};

export default DashboardMenu;
