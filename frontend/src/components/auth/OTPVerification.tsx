import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Shield, ArrowLeft, RotateCcw } from 'lucide-react';
import { bankingService } from '@/services/banking';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import type { OTPRequest } from '@/types/banking';

interface OTPVerificationProps {
    customerIdOrMobile: string;
    onBack: () => void;
    onSuccess: () => void;
}

export const OTPVerification = ({ customerIdOrMobile, onBack, onSuccess }: OTPVerificationProps) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string>('');
    const [countdown, setCountdown] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);

    const { setCustomerAuth } = useCustomerAuth();

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const verifyMutation = useMutation({
        mutationFn: (data: OTPRequest) => bankingService.verifyOTP(data),
        onSuccess: response => {
            setError('');
            setCustomerAuth(response.customer, response.accessToken);
            onSuccess();
        },
        onError: (error: any) => {
            setError(error?.response?.data?.message || 'Invalid OTP. Please try again.');
            setOtp('');
        }
    });

    const resendMutation = useMutation({
        mutationFn: () => bankingService.customerLogin({ customerIdOrMobile }),
        onSuccess: () => {
            setError('');
            setCountdown(300);
            setCanResend(false);
        },
        onError: (error: any) => {
            setError(error?.response?.data?.message || 'Failed to resend OTP. Please try again.');
        }
    });

    const handleOTPChange = (value: string) => {
        setOtp(value);
        setError('');

        // Auto-submit when OTP is complete
        if (value.length === 6) {
            verifyMutation.mutate({
                customerIdOrMobile,
                otp: value
            });
        }
    };

    const handleResend = () => {
        if (canResend) {
            resendMutation.mutate();
        }
    };

    const isLoading = verifyMutation.isPending || resendMutation.isPending;
    const maskedIdentifier =
        customerIdOrMobile.includes('+') || /^\d+$/.test(customerIdOrMobile)
            ? `***${customerIdOrMobile.slice(-4)}`
            : `${customerIdOrMobile.slice(0, 4)}***`;

    return (
        <Card className='w-full max-w-md mx-auto'>
            <CardHeader className='text-center space-y-2'>
                <Button
                    variant='ghost'
                    size='sm'
                    className='absolute left-4 top-4'
                    onClick={onBack}
                    disabled={isLoading}
                >
                    <ArrowLeft className='h-4 w-4' />
                </Button>

                <div className='mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
                    <Shield className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>

                <CardTitle className='text-2xl font-bold'>Enter OTP</CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                    We've sent a 6-digit code to {maskedIdentifier}
                </CardDescription>
            </CardHeader>

            <CardContent className='space-y-6'>
                <div className='space-y-4'>
                    <div className='flex justify-center'>
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={handleOTPChange}
                            disabled={isLoading}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot
                                    index={0}
                                    className='w-12 h-12 text-lg'
                                />
                                <InputOTPSlot
                                    index={1}
                                    className='w-12 h-12 text-lg'
                                />
                                <InputOTPSlot
                                    index={2}
                                    className='w-12 h-12 text-lg'
                                />
                                <InputOTPSlot
                                    index={3}
                                    className='w-12 h-12 text-lg'
                                />
                                <InputOTPSlot
                                    index={4}
                                    className='w-12 h-12 text-lg'
                                />
                                <InputOTPSlot
                                    index={5}
                                    className='w-12 h-12 text-lg'
                                />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading && (
                        <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Verifying OTP...
                        </div>
                    )}
                </div>

                <div className='text-center space-y-4'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {countdown > 0 ? (
                            <p>OTP expires in {formatTime(countdown)}</p>
                        ) : (
                            <p className='text-red-500'>OTP has expired</p>
                        )}
                    </div>

                    <Button
                        variant='outline'
                        onClick={handleResend}
                        disabled={!canResend || isLoading}
                        className='w-full'
                    >
                        {resendMutation.isPending ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Sending...
                            </>
                        ) : (
                            <>
                                <RotateCcw className='mr-2 h-4 w-4' />
                                Resend OTP
                            </>
                        )}
                    </Button>

                    <p className='text-xs text-gray-400'>
                        Didn't receive the code? Check your phone or contact bank staff
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
