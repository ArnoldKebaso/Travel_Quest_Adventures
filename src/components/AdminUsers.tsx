import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { NewNavigation } from './NewNavigation';
import { Footer } from './Footer';
import { Search, UserPlus, Trash2, UserX, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type Page = 'home' | 'listings' | 'destination' | 'account' | 'saved' | 'auth' | 'admin-auth' | 'admin-dashboard' | 'admin-add-guide' | 'admin-comments' | 'admin-users' | 'not-found' | 'blogs' | 'tours' | 'about' | 'contact' | 'tour-details' | 'blog-details';

interface AdminUsersProps {
  onNavigate: (page: Page) => void;
  user?: SupabaseUser | null;
  isAdmin?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Admin';
  registered: string;
  status: 'Active' | 'Suspended';
  avatar?: string;
}

interface InviteFormData {
  email: string;
  role: 'User' | 'Admin';
}

export function AdminUsers({ onNavigate, user, isAdmin }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState<InviteFormData>({ email: '', role: 'User' });

  // Mock data for demonstration
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@travelquest.com',
      role: 'Admin',
      registered: '2023-12-01',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'User',
      registered: '2024-01-15',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'User',
      registered: '2024-01-14',
      status: 'Suspended'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      role: 'User',
      registered: '2024-01-13',
      status: 'Active'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david@example.com',
      role: 'User',
      registered: '2024-01-12',
      status: 'Active'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      role: 'User',
      registered: '2024-01-11',
      status: 'Active'
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleRoleChange = (userId: string, newRole: 'User' | 'Admin') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast.success(`User role updated to ${newRole}`);
  };

  const handleStatusToggle = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        toast.success(`User ${newStatus.toLowerCase()} successfully`);
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success(`User ${userName} deleted successfully`);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email) {
      toast.error('Email is required');
      return;
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === inviteForm.email.toLowerCase());
    if (existingUser) {
      toast.error('User with this email already exists');
      return;
    }

    // Add new user
    const newUser: UserData = {
      id: Date.now().toString(),
      name: inviteForm.email.split('@')[0],
      email: inviteForm.email,
      role: inviteForm.role,
      registered: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setUsers(prev => [...prev, newUser]);
    toast.success(`Invitation sent to ${inviteForm.email}`);
    setInviteForm({ email: '', role: 'User' });
    setIsInviteModalOpen(false);
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'Admin' 
      ? 'bg-orange-100 text-orange-700 border-orange-200'
      : 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200';
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const adminUsers = users.filter(u => u.role === 'Admin').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NewNavigation 
        currentPage="admin-users" 
        onNavigate={onNavigate} 
        user={user || null}
        isAdmin={isAdmin}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
            </div>
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleInviteUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email Address</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="user@example.com"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select 
                      value={inviteForm.role} 
                      onValueChange={(value: 'User' | 'Admin') => setInviteForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsInviteModalOpen(false)}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 cursor-pointer"
                    >
                      Send Invitation
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrators</p>
                  <p className="text-3xl font-bold text-gray-900">{adminUsers}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-xl font-bold text-gray-900">Users</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-medium text-gray-900">User</TableHead>
                      <TableHead className="font-medium text-gray-900">Email</TableHead>
                      <TableHead className="font-medium text-gray-900">Role</TableHead>
                      <TableHead className="font-medium text-gray-900">Registered</TableHead>
                      <TableHead className="font-medium text-gray-900">Status</TableHead>
                      <TableHead className="font-medium text-gray-900 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-200">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-orange-100 text-orange-700">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(value: 'User' | 'Admin') => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="User">User</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(user.registered).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle(user.id)}
                              className={`cursor-pointer text-xs ${
                                user.status === 'Active' 
                                  ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                              }`}
                            >
                              {user.status === 'Active' ? (
                                <UserX className="w-4 h-4" />
                              ) : (
                                <User className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="cursor-pointer text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No users found</p>
                <p className="text-sm text-gray-400">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Invite users to get started'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer onNavigate={onNavigate} />
    </div>
  );
}