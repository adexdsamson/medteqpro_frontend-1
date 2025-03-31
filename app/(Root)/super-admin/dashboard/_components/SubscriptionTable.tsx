import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Subscription = {
  id: number;
  hospitalName: string;
  subscriptionDate: string;
  expiryDate: string;
  status: string;
};

const subscriptions: Subscription[] = [
  {
    id: 1,
    hospitalName: 'Lifehealth Hospital',
    subscriptionDate: '22-Mar-2025',
    expiryDate: '22-Apr-2025',
    status: 'Active',
  },
  {
    id: 2,
    hospitalName: 'Wellbeing Hospital',
    subscriptionDate: '22-Mar-2025',
    expiryDate: '22-Apr-2025',
    status: 'Active',
  },
  {
    id: 3,
    hospitalName: 'Greenlife Hospital',
    subscriptionDate: '22-Mar-2025',
    expiryDate: '22-Apr-2025',
    status: 'Active',
  },
  {
    id: 4,
    hospitalName: 'George Hospital',
    subscriptionDate: '22-Mar-2025',
    expiryDate: '22-Apr-2025',
    status: 'Active',
  },
  {
    id: 5,
    hospitalName: 'Bellacare Hospital',
    subscriptionDate: '22-Mar-2025',
    expiryDate: '22-Apr-2025',
    status: 'Active',
  },
  {
    id: 6,
    hospitalName: 'Carelife Hospital',
    subscriptionDate: '22-Mar-2025',
    expiryDate: '22-Apr-2025',
    status: 'Active',
  },
];

export function SubscriptionTable() {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Hospital Name</TableHead>
            <TableHead>Subscription Date</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.id}</TableCell>
              <TableCell>{subscription.hospitalName}</TableCell>
              <TableCell>{subscription.subscriptionDate}</TableCell>
              <TableCell>{subscription.expiryDate}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                  {subscription.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}