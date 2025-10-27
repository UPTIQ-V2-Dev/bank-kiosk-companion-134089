import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, FileText } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

interface LastVisitData {
    date: string;
    branch: string;
    purpose: string;
}

interface LastVisitWidgetProps {
    lastVisit: LastVisitData;
}

export const LastVisitWidget = ({ lastVisit }: LastVisitWidgetProps) => {
    return (
        <Card className='h-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
                <CardTitle className='text-lg font-semibold'>Last Visit</CardTitle>
                <Clock className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                    <div className='space-y-2 flex-1'>
                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                            <Clock className='h-4 w-4' />
                            <span>{formatDateTime(lastVisit.date)}</span>
                        </div>

                        <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                            <MapPin className='h-4 w-4' />
                            <span>{lastVisit.branch}</span>
                        </div>

                        <div className='flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400'>
                            <FileText className='h-4 w-4 mt-0.5 flex-shrink-0' />
                            <span className='leading-relaxed'>{lastVisit.purpose}</span>
                        </div>
                    </div>
                </div>

                <div className='pt-2 border-t border-gray-100 dark:border-gray-700'>
                    <p className='text-xs text-gray-500 dark:text-gray-400 text-center'>Thank you for visiting us!</p>
                </div>
            </CardContent>
        </Card>
    );
};
