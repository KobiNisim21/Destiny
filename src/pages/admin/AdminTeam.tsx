import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, UserCog } from "lucide-react";
import API_BASE_URL from "@/config";

// --- Types ---
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
    permissions?: string[];
    isSuperAdmin?: boolean;
    createdAt: string;
}

const ALL_PERMISSIONS = [
    { id: 'view_dashboard', label: 'צפייה בלוח בקרה' },
    { id: 'manage_products', label: 'ניהול מוצרים' },
    { id: 'manage_orders', label: 'ניהול הזמנות' },
    { id: 'manage_content', label: 'ניהול תוכן' },
    { id: 'manage_team', label: 'ניהול צוות (Super Admin)' },
];

const AdminTeam = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("team");
    const [users, setUsers] = useState<User[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Password Change State
    useEffect(() => {
        fetchAdmins();
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/team/admins`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return;
            }

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            if (Array.isArray(data)) {
                setAdmins(data);
            } else {
                console.error("Admins data is not an array:", data);
                setAdmins([]);
            }
        } catch (error) {
            console.error("Failed to fetch admins", error);
            toast({ title: "שגיאה בטעינת מנהלים", variant: "destructive" });
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/team/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return;
            }

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                console.error("Users data is not an array:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast({ title: "שגיאה בטעינת משתמשים", variant: "destructive" });
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setSelectedPermissions(user.permissions || []);
        setIsSuperAdmin(user.isSuperAdmin || false);
    };

    const handleSavePermissions = async () => {
        if (!editingUser) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/team/update-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: editingUser._id,
                    role: 'admin', // Always promote to admin if editing here
                    permissions: selectedPermissions,
                    isSuperAdmin: isSuperAdmin
                })
            });

            if (res.ok) {
                toast({ title: "הצלחה", description: "הרשאות המשתמש עודכנו בהצלחה" });
                setEditingUser(null);
                fetchAdmins();
                fetchUsers(); // Refresh both lists
            } else {
                const err = await res.json();
                toast({ title: "שגיאה", description: err.message || "נכשל בעדכון הרשאות", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "שגיאה", description: "שגיאת תקשורת", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAdmin = async (user: User) => {
        if (!confirm("האם אתה בטוח שברצונך להסיר את הרשאות הניהול ממשתמש זה?")) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/team/update-role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: user._id,
                    role: 'user', // Demote to regular user
                    permissions: [],
                    isSuperAdmin: false
                })
            });

            if (res.ok) {
                toast({ title: "הצלחה", description: "משתמש הוסר מצוות הניהול" });
                fetchAdmins();
            } else {
                toast({ title: "שגיאה", description: "נכשל בהסרת משתמש", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8" dir="rtl">
            <div style={{ textAlign: 'right' }}>
                <h1 className="text-3xl font-bold font-['Assistant'] text-gray-900">ניהול צוות והרשאות</h1>
                <p className="text-gray-500 mt-2 font-['Assistant']">צפייה במנהלי המערכת, ניהול תפקידים והרשאות גישה.</p>
            </div>

            <Tabs defaultValue="team" className="w-full" onValueChange={setActiveTab} dir="rtl">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        <TabsTrigger
                            value="team"
                            className="rounded-lg px-6 data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white font-medium transition-all"
                        >
                            מנהלים פעילים ({admins.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="rounded-lg px-6 data-[state=active]:bg-[#9F19FF] data-[state=active]:text-white font-medium transition-all"
                        >
                            כל המשתמשים
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="team" className="mt-0">
                    <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden text-right">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900 text-right">צוות האתר</CardTitle>
                                    <CardDescription className="mt-1 text-right">רשימת המנהלים ובעלי התפקידים באתר</CardDescription>
                                </div>
                                <ShieldCheck className="text-[#9F19FF] opacity-20 w-8 h-8" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table className="text-right">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">שם מלא</TableHead>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">אימייל</TableHead>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">תפקיד</TableHead>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">פעולות</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admins.map((admin) => (
                                        <TableRow key={admin._id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-100">
                                            <TableCell className="font-medium py-4 text-right !text-right">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#9F19FF] font-bold text-xs">
                                                        {admin.firstName[0]}{admin.lastName[0]}
                                                    </div>
                                                    {admin.firstName} {admin.lastName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600 font-sans text-right !text-right">{admin.email}</TableCell>
                                            <TableCell className="text-right !text-right">
                                                {admin.isSuperAdmin ? (
                                                    <Badge className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white shadow-sm shadow-purple-200">
                                                        Super Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                        Admin
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="flex gap-2 text-right !text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditClick(admin)}
                                                            className="hover:border-[#9F19FF] hover:text-[#9F19FF] transition-colors"
                                                        >
                                                            <UserCog className="w-4 h-4 ml-2" />
                                                            ערוך הרשאות
                                                        </Button>
                                                    </DialogTrigger>
                                                    {/* Dialog content handles update */}
                                                </Dialog>

                                                {!admin.isSuperAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveAdmin(admin)}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        הסר
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="mt-0">
                    <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden text-right">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900 text-right">משתמשים רשומים</CardTitle>
                                    <CardDescription className="mt-1 text-right">איתור משתמשים לשדרוג לתפקיד ניהולי</CardDescription>
                                </div>
                                <div className="relative w-full md:w-auto">
                                    <Input
                                        placeholder="חפש לפי שם או אימייל..."
                                        className="w-full md:w-[300px] bg-white border-gray-200 focus:border-[#9F19FF] focus:ring-[#9F19FF]/20 text-right"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table className="text-right">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">שם מלא</TableHead>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">אימייל</TableHead>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">תאריך הצטרפות</TableHead>
                                        <TableHead className="!text-right py-4 font-bold text-gray-700">פעולות</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.filter(u => u.role !== 'admin').map((user) => (
                                        <TableRow key={user._id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-100">
                                            <TableCell className="font-medium py-4 text-right !text-right">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                        {user.firstName[0]}{user.lastName[0]}
                                                    </div>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600 font-sans text-right !text-right">{user.email}</TableCell>
                                            <TableCell className="text-gray-500 font-sans text-right !text-right">{new Date(user.createdAt).toLocaleDateString('he-IL')}</TableCell>
                                            <TableCell className="text-right !text-right">
                                                <Button
                                                    onClick={() => handleEditClick(user)}
                                                    className="bg-white border-2 border-[#9F19FF] text-[#9F19FF] hover:bg-[#9F19FF] hover:text-white transition-all shadow-none hover:shadow-lg hover:shadow-[#9F19FF]/20 font-medium"
                                                    size="sm"
                                                >
                                                    <ShieldCheck className="w-4 h-4 ml-2" />
                                                    הפוך למנהל
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Permissions Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-xl text-center">עריכת הרשאות</DialogTitle>
                        <DialogDescription className="text-center">
                            עבור המשתמש <span className="font-bold text-gray-900">{editingUser?.firstName} {editingUser?.lastName}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Super Admin Toggle */}
                        <div
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${isSuperAdmin ? 'border-[#9F19FF] bg-purple-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                            onClick={() => setIsSuperAdmin(!isSuperAdmin)}
                        >
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-900 cursor-pointer">
                                    Super Admin
                                </label>
                                <p className="text-xs text-gray-500">גישה מלאה לכל חלקי המערכת ללא הגבלה</p>
                            </div>
                            <Checkbox
                                id="superAdmin"
                                checked={isSuperAdmin}
                                onCheckedChange={(checked) => setIsSuperAdmin(checked as boolean)}
                                className="data-[state=checked]:bg-[#9F19FF] data-[state=checked]:border-[#9F19FF]"
                            />
                        </div>

                        {/* Granular Permissions */}
                        <div className={`space-y-3 transition-opacity duration-200 ${isSuperAdmin ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <h4 className="font-medium text-sm text-gray-900 mb-3">או בחר הרשאות ספציפיות:</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {ALL_PERMISSIONS.filter(p => p.id !== 'manage_team').map((perm) => (
                                    <div
                                        key={perm.id}
                                        className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                                    >
                                        <Checkbox
                                            id={perm.id}
                                            checked={selectedPermissions.includes(perm.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedPermissions([...selectedPermissions, perm.id]);
                                                } else {
                                                    setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                                                }
                                            }}
                                            className="data-[state=checked]:bg-[#9F19FF] data-[state=checked]:border-[#9F19FF]"
                                        />
                                        <label
                                            htmlFor={perm.id}
                                            className="text-sm font-medium leading-none cursor-pointer flex-1 user-select-none"
                                        >
                                            {perm.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setEditingUser(null)} className="rounded-xl">ביטול</Button>
                            <Button
                                onClick={handleSavePermissions}
                                disabled={loading}
                                className="bg-[#9F19FF] hover:bg-[#9F19FF]/90 text-white rounded-xl px-6"
                            >
                                {loading ? 'שומר...' : 'שמור שינויים'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminTeam;
