import { listUsers } from './queries';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { CreateUserDialog } from './components/CreateUserDialog';
import { EditUserDialog } from './components/EditUserDialog';
import { DeleteUserButton } from './components/DeleteUserButton';
import { Copyable } from '@/components/copyable';

export default async function UsersPage() {
  const { users } = await listUsers();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            Gérer les utilisateurs et créer de nouveaux comptes.
          </CardDescription>
        </div>
        <CreateUserDialog />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead className="w-[180px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Copyable value={String(u.id)} label="ID utilisateur" />
                  </TableCell>
                  <TableCell>
                    {u.name ? (
                      <Copyable value={u.name} label="Nom" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Copyable value={u.email} label="Email" />
                  </TableCell>
                  <TableCell>
                    {u.username ? (
                      <Copyable value={u.username} label="Nom d'utilisateur" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditUserDialog
                        user={{
                          id: u.id,
                          email: u.email,
                          name: u.name ?? null,
                          username: u.username ?? null
                        }}
                      />
                      <DeleteUserButton id={u.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
