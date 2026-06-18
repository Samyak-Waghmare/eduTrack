import React, { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserRoleMutation } from '@/features/api/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Loader2, ShieldAlert, GraduationCap, Crown, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { toast } from 'sonner';

const UsersTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllUsersQuery({ page, limit: 10 });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const res = await deleteUser(userId).unwrap();
        toast.success(res.message || 'User deleted successfully');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateRole({ userId, role: newRole }).unwrap();
      toast.success(res.message || 'Role updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update role');
    }
  };

  const getRoleBadgeProps = (role) => {
    switch (role) {
      case 'Admin': return { color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: ShieldAlert };
      case 'Instructor': return { color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Crown };
      default: return { color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', icon: GraduationCap };
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="font-semibold tracking-wide">Loading users...</p>
    </div>
  );
  
  if (isError) return (
    <div className="text-center py-20 text-destructive">
        <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="font-bold">Failed to load users.</p>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/10">
          <TableRow className="border-border/40 hover:bg-transparent">
            <TableHead className="w-[300px] font-bold text-foreground py-4 px-6">User</TableHead>
            <TableHead className="font-bold text-foreground py-4">Role Status</TableHead>
            <TableHead className="w-[180px] font-bold text-foreground py-4">Change Role</TableHead>
            <TableHead className="text-right font-bold text-foreground py-4 px-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/40">
          {data?.users?.map((user) => {
            const roleProps = getRoleBadgeProps(user.role);
            const RoleIcon = roleProps.icon;
            
            return (
              <TableRow key={user._id} className="group hover:bg-muted/30 transition-colors border-0">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                      <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleProps.color}`}>
                    <RoleIcon size={12} /> {user.role}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(val) => handleRoleChange(user._id, val)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[140px] h-9 text-xs font-semibold bg-background border-border/60 focus:ring-primary focus:ring-offset-0 transition-shadow">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/60">
                      <SelectItem value="Student" className="font-medium cursor-pointer">Student</SelectItem>
                      <SelectItem value="Instructor" className="font-medium cursor-pointer">Instructor</SelectItem>
                      <SelectItem value="Admin" className="font-medium cursor-pointer">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl"
                    onClick={() => handleDelete(user._id)}
                    disabled={isDeleting}
                    title="Delete User"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
          {data?.users?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold text-lg">No users found</p>
                <p className="text-sm">The platform has no registered users yet.</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/5">
          <p className="text-sm text-muted-foreground font-medium">
            Showing <span className="font-bold text-foreground">{(page - 1) * 10 + 1}</span> to <span className="font-bold text-foreground">{Math.min(page * 10, data.pagination.totalUsers)}</span> of <span className="font-bold text-foreground">{data.pagination.totalUsers}</span> users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 gap-1 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-1 mx-2">
              <span className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary rounded-md">{page}</span>
              <span className="text-sm text-muted-foreground">/ {data.pagination.totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page === data.pagination.totalPages}
              className="h-8 gap-1 rounded-lg"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
