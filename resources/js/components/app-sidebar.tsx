import { Link } from '@inertiajs/react';
import { ListChecks, PartyPopper, PlusSquare } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { create as delegationCreate } from '@/routes/delegations';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Add Delegation',
        href: delegationCreate.url(),
        icon: PlusSquare,
    },
    {
        title: 'List Delegations',
        href: '/delegations',
        icon: ListChecks,
    },
    {
        title: 'Social registrations',
        href: '/social-registrations',
        icon: PartyPopper,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={delegationCreate.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
