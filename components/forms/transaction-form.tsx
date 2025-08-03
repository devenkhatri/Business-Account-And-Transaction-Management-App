'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, Account, Location } from '@/types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  transaction?: Transaction;
}

export function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  transaction,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    transactionNo: '',
    date: '',
    amount: '',
    type: 'CREDIT' as 'CREDIT' | 'DEBIT',
    description: '',
    accountId: '0',
    locationId: '0',
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/accounts').then((res) => res.json()),
      fetch('/api/locations').then((res) => res.json()),
    ])
      .then(([accountsData, locationsData]) => {
        setAccounts(accountsData);
        setLocations(locationsData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (transaction) {
      setFormData({
        transactionNo: transaction.transactionNo,
        date: transaction.date.toString().split('T')[0],
        amount: transaction.amount.toString(),
        type: transaction.type,
        description: transaction.description || '',
        accountId: transaction.accountId.toString(),
        locationId: transaction.locationId.toString(),
      });
    } else {
      setFormData({
        transactionNo: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'CREDIT',
        description: '',
        accountId: '0',
        locationId: '0',
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that account and location are selected
    if (formData.accountId === '0' || formData.locationId === '0') {
      alert('Please select both account and location');
      return;
    }
    
    setIsLoading(true);

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        accountId: parseInt(formData.accountId),
        locationId: parseInt(formData.locationId),
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="transactionNo">Transaction Number</Label>
            <Input
              id="transactionNo"
              value={formData.transactionNo}
              onChange={(e) =>
                setFormData({ ...formData, transactionNo: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'CREDIT' | 'DEBIT') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountId">Account</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) =>
                setFormData({ ...formData, accountId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>Select an account</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="locationId">Location</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" disabled>Select a location</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : transaction ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}