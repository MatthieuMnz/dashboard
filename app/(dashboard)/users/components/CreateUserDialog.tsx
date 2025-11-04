'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createUser, resetUserPasswordAction } from '../actions';
import { createUserSchema, type CreateUserInput } from '../schemas';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PasswordDisplay } from './PasswordDisplay';
import { Plus } from 'lucide-react';

type Props = {
  onCreated?: () => void;
};

export function CreateUserDialog({ onCreated }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [createdUserId, setCreatedUserId] = useState<number | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', name: '', username: '' }
  });

  async function onSubmit(values: CreateUserInput) {
    const result = await createUser(values);
    setGeneratedPassword(result.plaintextPassword);
    setCreatedUserId(result.user.id);
    onCreated?.();
    router.refresh();
  }

  function handleClose() {
    setOpen(false);
    setGeneratedPassword(null);
    setCreatedUserId(null);
    form.reset();
  }

  async function handleRegenerate() {
    if (!createdUserId) return;
    setRegenLoading(true);
    try {
      const { plaintextPassword } = await resetUserPasswordAction(createdUserId);
      setGeneratedPassword(plaintextPassword);
    } finally {
      setRegenLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      } else {
        setOpen(true);
      }
    }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Create user</TooltipContent>
      </Tooltip>
      <DialogContent>
        {!generatedPassword ? (
          <>
            <DialogHeader>
              <DialogTitle>Create user</DialogTitle>
              <DialogDescription>Provide details. A secure password will be generated and shown once.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating…' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Copy the password now</DialogTitle>
              <DialogDescription>This password is shown only once. Please store it securely.</DialogDescription>
            </DialogHeader>
            <PasswordDisplay
              password={generatedPassword}
              onRegenerate={handleRegenerate}
              regenerateLoading={regenLoading}
            />
            <DialogFooter>
              <Button type="button" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}


