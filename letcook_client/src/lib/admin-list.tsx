import {
  Bookmark,
  Edit,
  LayoutGrid,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  ShoppingBasket,
  CookingPot,
  BarChart2 // Add this import
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};
type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};
type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin',
          label: 'Dashboard',
          active: pathname.includes('/admin'),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Manage',
      menus: [
        {
          href: '/admin/product',
          label: 'Product',
          active: pathname.includes('/admin/product'),
          icon: ShoppingBag,
          submenus: [
            {
              href: '/admin/product',
              label: 'Products',
              active: pathname === '/admin/product',
            },
            {
              href: '/admin/productCategory',
              label: 'Product Category',
              active: pathname === '/admin/productCategory',
            },
            {
              href: '/admin/measurement',
              label: 'Measurement',
              active: pathname === '/admin/measurement',
            },
          ],
        },
        {
          href: '/categories',
          label: 'Categories',
          active: pathname.includes('/categories'),
          icon: Bookmark,
          submenus: [],
        },
        
        {
          href: '/admin/orders',
          label: 'Order',
          active: pathname.includes('/orders'),
          icon: ShoppingBasket,
          submenus: [],
        },
        {
          href: '/admin/recipe',
          label: 'Recipe',
          active: pathname.includes('/recipe'),
          icon: CookingPot,
          submenus: [],
        },
        {
          href: '/tags',
          label: 'Tags',
          active: pathname.includes('/tags'),
          icon: Tag,
          submenus: [],
        },
       
        {
          href: '/admin/post',
          label: 'Post',
          active: pathname.includes('/admin/post'),
          icon: Edit,
          submenus: [],
        },
        {
          href: '/admin/report',
          label: 'Report',
          active: pathname.includes('/admin/report'),
          icon: BarChart2,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/users',
          label: 'Users',
          active: pathname.includes('/users'),
          icon: Users,
          submenus: [],
        },
        {
          href: '/account',
          label: 'Account',
          active: pathname.includes('/account'),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
