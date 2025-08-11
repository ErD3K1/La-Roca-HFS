import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/bags/bags-list',
    label: 'Bags',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiBagPersonal' in icon ? icon['mdiBagPersonal' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_BAGS'
  },
  {
    href: '/boutiques/boutiques-list',
    label: 'Boutiques',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiStore' in icon ? icon['mdiStore' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_BOUTIQUES'
  },
  {
    href: '/memberships/memberships-list',
    label: 'Memberships',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiStarCircle' in icon ? icon['mdiStarCircle' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_MEMBERSHIPS'
  },
  {
    href: '/reservations/reservations-list',
    label: 'Reservations',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCalendarCheck' in icon ? icon['mdiCalendarCheck' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_RESERVATIONS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
