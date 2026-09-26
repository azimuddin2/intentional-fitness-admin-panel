'use client';

import { Bell, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Notification = () => {
  const notificationsData = [
    {
      id: 1,
      message:
        'Your cancellation request has been approved. Refund of $60.00 processed.',
      timestamp: 'Fri, 12:30pm',
      isActive: true,
    },
    {
      id: 2,
      message:
        '🎉 Special Offer: 20% off your next booking at Glow Salon! Book by May 30, 2025.',
      timestamp: 'Fri, 12:30pm',
      isActive: false,
    },
    {
      id: 3,
      message:
        '📅 Appointment Confirmed: Formal Updo at Glow Salon on May 6, 2025, 1:00 PM - 2:15 PM.',
      timestamp: 'Fri, 12:30pm',
      isActive: true,
    },
    {
      id: 4,
      message:
        'Your cancellation request has been approved. Refund of $60.00 processed.',
      timestamp: 'Fri, 12:30pm',
      isActive: false,
    },
    {
      id: 5,
      message:
        '🎉 Special Offer: 20% off your next booking at Glow Salon! Book by May 30, 2025.',
      timestamp: 'Fri, 12:30pm',
      isActive: true,
    },
    {
      id: 6,
      message:
        '📅 Appointment Confirmed: Formal Updo at Glow Salon on May 6, 2025, 1:00 PM - 2:15 PM.',
      timestamp: 'Fri, 12:30pm',
      isActive: false,
    },
  ];

  return (
    <div className="font-sora p-3 md:p-6 lg:w-4/5">
      {/* Header */}
      <div className="mb-8">
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="text-[#1c3b4a] bg-transparent border-[#1c3b4a]"
          >
            <Filter className="w-4 h-4 mr-2 text-[#1c3b4a]" />
            <span className="text-[#1c3b4a]">Filter All</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-500 hover:bg-red-50 bg-transparent"
          >
            Mark as Delete
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notificationsData.map((notification) => (
          <Card key={notification.id} className="p-4 bg-white shadow">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  notification.isActive == true
                    ? ' bg-[#1c3b4a] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm leading-relaxed">
                  {notification.message}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notification;
