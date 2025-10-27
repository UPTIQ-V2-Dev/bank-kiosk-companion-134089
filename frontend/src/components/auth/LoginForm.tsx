import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, User } from 'lucide-react';
import { bankingService } from '@/services/banking';
import type { CustomerLoginRequest } from '@/types/banking';

const loginSchema = z.object({
    customerIdOrMobile: z.string().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onOTPSent: (customerIdOrMobile: string) => void;
}

export const LoginForm = ({ onOTPSent }: LoginFormProps) => {
    const [error, setError] = useState<string>('');

    const { register, handleSubmit } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const loginMutation = useMutation({
        mutationFn: (data: CustomerLoginRequest) => bankingService.customerLogin(data),
        onSuccess: (response, variables) => {
            setError('');
            onOTPSent(variables.customerIdOrMobile);
        },
        onError: (error: any) => {
            setError(error?.response?.data?.message || 'Login failed. Please try again.');
        }
    });

    const onSubmit = (data: LoginFormData) => {
        setError('');
        // Use default value for testing if no input provided
        const customerIdOrMobile = data.customerIdOrMobile || 'TEST123';
        loginMutation.mutate({ customerIdOrMobile });
    };

    const isLoading = loginMutation.isPending;

    return (
        <Card className='w-full max-w-md mx-auto'>
            <CardHeader className='text-center space-y-2'>
                <div className='mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
                    <User className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
                <CardTitle className='text-2xl font-bold'>Welcome to Banking Kiosk</CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                    Enter your Customer ID or mobile number to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-2'>
                        <Label
                            htmlFor='customerIdOrMobile'
                            className='text-sm font-medium'
                        >
                            Customer ID or Mobile Number
                        </Label>
                        <div className='relative'>
                            <Input
                                id='customerIdOrMobile'
                                {...register('customerIdOrMobile')}
                                placeholder='Enter Customer ID or +1234567890'
                                className='pl-10 text-lg py-6 text-center'
                                disabled={isLoading}
                                autoComplete='off'
                            />
                            <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                                <Smartphone className='h-5 w-5 text-gray-400' />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type='submit'
                        className='w-full py-6 text-lg font-semibold'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                Sending OTP...
                            </>
                        ) : (
                            'Send OTP'
                        )}
                    </Button>

                    <div className='text-center space-y-2 text-sm text-gray-500 dark:text-gray-400'>
                        <p>For security, we'll send an OTP to your registered mobile number</p>
                        <p className='text-xs'>Need help? Contact bank staff for assistance</p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
