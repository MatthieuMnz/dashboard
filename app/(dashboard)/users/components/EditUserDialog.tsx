'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { updateUserAction, resetUserPasswordAction } from '../actions';
import { createUserSchema } from '../schemas';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { PasswordDisplay } from './PasswordDisplay';
import { Pencil } from 'lucide-react';

type Props = {
  user: {
    id: number;
    email: string;
    name: string | null;
    username: string | null;
  };
};

type EditInput = {
  email: string;
  name?: string;
  username?: string;
};

export function EditUserDialog({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [passwordLoading, setPasswordLoading] = useState(false);

  const form = useForm<EditInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: user.email,
      name: user.name ?? '',
      username: user.username ?? ''
    }
  });

  async function onSubmit(values: EditInput) {
    await updateUserAction(user.id, values);
    setOpen(false);
    setShowPasswordSection(false);
    setGeneratedPassword(null);
    form.reset();
    router.refresh();
  }

  async function handleGeneratePassword() {
    setPasswordLoading(true);
    try {
      const { plaintextPassword } = await resetUserPasswordAction(user.id);
      setGeneratedPassword(plaintextPassword);
      setShowPasswordSection(true);
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setShowPasswordSection(false);
    setGeneratedPassword(null);
    form.reset({
      email: user.email,
      name: user.name ?? '',
      username: user.username ?? ''
    });
  }

  async function handleRegeneratePassword() {
    await handleGeneratePassword();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Modifier</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Mettez à jour les détails de l'utilisateur et le mot de passe.
          </DialogDescription>
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
                    <Input type="email" {...field} />
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
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Mot de passe</h4>
                  <p className="text-sm text-muted-foreground">
                    Réinitialiser le mot de passe de l'utilisateur
                  </p>
                </div>
                {!showPasswordSection && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeneratePassword}
                    disabled={passwordLoading}
                  >
                    {passwordLoading
                      ? 'Génération…'
                      : 'Générer un nouveau mot de passe'}
                  </Button>
                )}
              </div>
              {showPasswordSection && generatedPassword && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ce mot de passe n'est affiché qu'une seule fois. Veuillez le
                    stocker de manière sécurisée.
                  </p>
                  <PasswordDisplay
                    password={generatedPassword}
                    onRegenerate={handleRegeneratePassword}
                    regenerateLoading={passwordLoading}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Enregistrement…'
                  : 'Enregistrer les modifications'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
