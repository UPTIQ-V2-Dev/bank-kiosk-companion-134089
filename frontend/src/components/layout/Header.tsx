import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Building2 } from 'lucide-react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { formatCurrency } from '@/utils/formatters';

interface HeaderProps {
    totalBalance?: number;
}

export const Header = ({ totalBalance }: HeaderProps) => {
    const { customer, logout } = useCustomerAuth();

    const handleLogout = () => {
        logout();
        window.location.href = '/auth';
    };

    if (!customer) {
        return null;
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <header className='sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'>
            <div className='container mx-auto px-4 py-4'>
                <div className='flex items-center justify-between'>
                    {/* Logo and Bank Name */}
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                            <Building2 className='h-6 w-6 text-white' />
                        </div>
                        <div>
                            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>Banking Kiosk</h1>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>Self-Service Portal</p>
                        </div>
                    </div>

                    {/* Balance Display */}
                    {totalBalance !== undefined && (
                        <div className='hidden md:block'>
                            <div className='text-right'>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>Total Balance</p>
                                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                                    {formatCurrency(totalBalance)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                className='relative h-12 w-12 rounded-full'
                            >
                                <Avatar className='h-10 w-10'>
                                    <AvatarFallback className='bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'>
                                        {getInitials(customer.firstName, customer.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-64'
                            align='end'
                            forceMount
                        >
                            <DropdownMenuLabel className='font-normal'>
                                <div className='flex flex-col space-y-2'>
                                    <p className='text-sm font-medium leading-none'>
                                        {customer.firstName} {customer.lastName}
                                    </p>
                                    <div className='text-xs leading-none text-gray-500 dark:text-gray-400 space-y-1'>
                                        <p>ID: {customer.customerId}</p>
                                        <p>Account: {customer.accountType}</p>
                                        <p>{customer.branch}</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer'>
                                <User className='mr-2 h-4 w-4' />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950'
                                onClick={handleLogout}
                            >
                                <LogOut className='mr-2 h-4 w-4' />
                                <span>Sign Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};
