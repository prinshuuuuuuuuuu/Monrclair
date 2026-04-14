import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Trash2,
  Search,
  MoreVertical,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Ticket,
  Filter,
  ChevronLeft,
  ChevronRight,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  ShoppingBag,
  Eye,
  Settings,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Coupon {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount_limit: number | null;
  start_date: string;
  expiry_date: string;
  usage_limit_total: number | null;
  usage_limit_per_user: number;
  used_count: number;
  status: "active" | "inactive" | "disabled";
  created_at: string;
}

interface UsageTracking {
  id: number;
  user_name: string;
  user_email: string;
  order_id: number;
  discount_amount: number;
  order_total: number;
  order_status: string;
  used_at: string;
}

export default function AdminCoupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddPopUpOpen, setIsAddPopUpOpen] = useState(false);
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [selectedCouponForUsage, setSelectedCouponForUsage] =
    useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_value: "0",
    max_discount_limit: "",
    start_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    expiry_date: "",
    usage_limit_total: "",
    usage_limit_per_user: "1",
    status: "active",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const firstPageLimit = 5;
  const nextPagesLimit = 6;

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data } = await api.get("/admin/coupons");
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-coupons-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/coupons/stats");
      return data;
    },
  });

  const { data: usageData = [], isLoading: isUsageLoading } = useQuery<
    UsageTracking[]
  >({
    queryKey: ["admin-coupon-usage", selectedCouponForUsage?.id],
    queryFn: async () => {
      if (!selectedCouponForUsage) return [];
      const { data } = await api.get(
        `/admin/coupons/${selectedCouponForUsage.id}/usage`,
      );
      return data;
    },
    enabled: !!selectedCouponForUsage && isUsageModalOpen,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post("/admin/coupons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coupons-stats"] });
      setIsAddPopUpOpen(false);
      resetForm();
      toast({ title: "Success", description: "Coupon created successfully." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create coupon",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await api.put(`/admin/coupons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coupons-stats"] });
      setIsEditPopUpOpen(false);
      setEditingCoupon(null);
      toast({ title: "Success", description: "Coupon updated successfully." });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coupons-stats"] });
      toast({ title: "Deleted", description: "Coupon removed successfully." });
    },
  });

  const resetForm = () => {
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_value: "0",
      max_discount_limit: "",
      start_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expiry_date: "",
      usage_limit_total: "",
      usage_limit_per_user: "1",
      status: "active",
    });
  };

  const handleCreateSubmit = () => {
    if (!formData.code || !formData.discount_value || !formData.expiry_date) {
      toast({
        title: "Validation Error",
        description: "Please fill required fields.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = () => {
    if (!editingCoupon) return;
    updateMutation.mutate({ id: editingCoupon.id, data: editingCoupon });
  };

  const toggleStatus = (coupon: Coupon) => {
    const newStatus = coupon.status === "disabled" ? "active" : "disabled";
    updateMutation.mutate({ id: coupon.id, data: { status: newStatus } });
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isExpired = new Date(c.expiry_date) < new Date();
    let currentStatus = c.status;
    if (c.status !== "disabled" && isExpired) currentStatus = "inactive";

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && currentStatus === "active") ||
      (statusFilter === "inactive" && currentStatus === "inactive") ||
      (statusFilter === "disabled" && currentStatus === "disabled");

    return matchesSearch && matchesStatus;
  });

  const startIndex =
    currentPage === 1 ? 0 : firstPageLimit + (currentPage - 2) * nextPagesLimit;
  const currentLimit = currentPage === 1 ? firstPageLimit : nextPagesLimit;
  const paginatedCoupons = filteredCoupons.slice(
    startIndex,
    startIndex + currentLimit,
  );
  const totalPages =
    filteredCoupons.length <= firstPageLimit
      ? 1
      : 1 +
        Math.ceil((filteredCoupons.length - firstPageLimit) / nextPagesLimit);

  const statCards = [
    {
      label: "Total Coupons",
      value: stats?.total || 0,
      icon: Ticket,
      color: "bg-[#b87333]",
    },
    {
      label: "Active",
      value: stats?.active || 0,
      icon: CheckCircle2,
      color: "bg-[#b87333]",
    },
    {
      label: "Inactive / Expired",
      value: stats?.inactive || 0,
      icon: XCircle,
      color: "bg-[#b87333]",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tighter text-[#1e293b] dark:text-white">
            Coupon <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Create and track promotional offers for your customers.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsAddPopUpOpen(true);
          }}
          className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 gap-2"
        >
          <Plus size={20} />
          Add New Coupon
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] font-medium">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-bold text-[#0f172a] mt-1">
                  {stat.value}
                </h3>
              </div>
              <div
                className={cn(
                  "p-4 rounded-2xl transition-colors",
                  stat.color,
                  "bg-opacity-10",
                )}
              >
                <stat.icon
                  size={24}
                  className={cn(stat.color.replace("bg-", "text-"))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search coupon codes..."
            className="pl-10 h-11 bg-background/50 border-[#e2e8f0] focus:ring-primary/20 rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] h-11 bg-background/50 border-[#e2e8f0] rounded-xl">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Expired</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || statusFilter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="h-11 px-4 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-all duration-300 gap-2 font-medium group"
            >
              <RotateCcw className="h-4 w-4 group-hover:rotate-[-45deg] transition-transform duration-300" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <Card className="border-none shadow-premium overflow-hidden bg-background/50 backdrop-blur-sm rounded-2xl">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Code</TableHead>
              <TableHead className="font-bold">Discount</TableHead>
              <TableHead className="font-bold">Usage</TableHead>
              <TableHead className="font-bold">Expiry Date</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCoupons.length > 0 ? (
              paginatedCoupons.map((coupon) => {
                const isExpired = new Date(coupon.expiry_date) < new Date();
                const displayStatus =
                  coupon.status === "disabled"
                    ? "disabled"
                    : isExpired
                      ? "expired"
                      : "active";

                return (
                  <TableRow
                    key={coupon.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Ticket size={18} className="text-primary" />
                        </div>
                        <span className="font-black text-slate-800 dark:text-slate-200 tracking-wider">
                          {coupon.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-bold rounded-lg px-2 flex items-center gap-1 w-fit"
                      >
                        {coupon.discount_type === "percentage" ? (
                          <>
                            <Percent size={12} /> {coupon.discount_value}%
                          </>
                        ) : (
                          <>
                            <IndianRupee size={12} /> {coupon.discount_value}
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">
                          {coupon.used_count} used
                        </span>
                        {coupon.usage_limit_total && (
                          <span className="text-[10px] text-muted-foreground uppercase">
                            Limit: {coupon.usage_limit_total}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground" />
                        {format(new Date(coupon.expiry_date), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "rounded-full px-3",
                          displayStatus === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                            : displayStatus === "expired"
                              ? "bg-amber-500/10 text-amber-600 border-amber-200"
                              : "bg-slate-500/10 text-slate-600 border-slate-200",
                        )}
                        variant="outline"
                      >
                        {displayStatus.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={coupon.status === "active"}
                          onCheckedChange={() => toggleStatus(coupon)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 p-2 rounded-xl"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingCoupon({ ...coupon });
                                setIsEditPopUpOpen(true);
                              }}
                              className="gap-2 cursor-pointer rounded-lg"
                            >
                              <Edit2 size={14} /> Edit Coupon
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCouponForUsage(coupon);
                                setIsUsageModalOpen(true);
                              }}
                              className="gap-2 cursor-pointer rounded-lg"
                            >
                              <Eye size={14} /> View Usage
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="gap-2 text-rose-500 cursor-pointer rounded-lg"
                                >
                                  <Trash2 size={14} /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Coupon?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will delete the{" "}
                                    <strong>{coupon.code}</strong> coupon code
                                    permanently.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteMutation.mutate(coupon.id)
                                    }
                                    className="bg-rose-500 hover:bg-rose-600 rounded-xl"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                    <Ticket size={48} />
                    <p className="text-lg font-medium">No coupons found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Showing {paginatedCoupons.length} of {filteredCoupons.length}{" "}
              Coupons
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="rounded-xl"
              >
                <ChevronLeft size={18} />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                      "w-10 h-10 rounded-xl font-bold",
                      currentPage === i + 1 && "shadow-md",
                    )}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded-xl"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
      <Dialog open={isAddPopUpOpen} onOpenChange={setIsAddPopUpOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden">
          <div className="p-6 bg-primary text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Ticket size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic">
                CREATE NEW COUPON
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Define rules for the new discount campaign.
              </DialogDescription>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Coupon Code
                </label>
                <Input
                  placeholder="e.g. SUMMER2024"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="h-12 rounded-xl font-bold border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Discount Type
                </label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, discount_type: val })
                  }
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Value
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_value: e.target.value,
                      })
                    }
                    className="h-12 rounded-xl border-slate-200 pl-8"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {formData.discount_type === "percentage" ? (
                      <Percent size={14} />
                    ) : (
                      <IndianRupee size={14} />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Min Order
                </label>
                <Input
                  type="number"
                  value={formData.min_order_value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_order_value: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Max Cap (%)
                </label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  disabled={formData.discount_type === "fixed"}
                  value={formData.max_discount_limit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_discount_limit: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Start Date
                </label>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2 bg-rose-50/50 p-3 rounded-2xl border border-rose-100">
                <label className="text-xs font-bold uppercase tracking-widest text-rose-600">
                  Expiry Date *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                  className="h-10 mt-1 rounded-lg border-rose-200 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Total Usage Limit
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={formData.usage_limit_total}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usage_limit_total: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Limit Per User
                </label>
                <Input
                  type="number"
                  value={formData.usage_limit_per_user}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usage_limit_per_user: e.target.value,
                    })
                  }
                  className="h-12 rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-slate-50 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsAddPopUpOpen(false)}
              className="rounded-xl h-12 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={createMutation.isPending}
              className="rounded-xl h-12 px-10 bg-black hover:bg-slate-800 text-white font-bold"
            >
              {createMutation.isPending ? "Creating..." : "Save Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     <Dialog open={isEditPopUpOpen} onOpenChange={setIsEditPopUpOpen}>
  <DialogContent className="w-[95%] sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">

    {/* HEADER */}
    <div className="p-4 sm:p-6 bg-[#96723b] text-white flex items-center gap-3">
      <Settings size={22} />
      <div>
        <DialogTitle className="text-lg sm:text-2xl font-black italic">
          EDIT COUPON
        </DialogTitle>
        <DialogDescription className="text-white/70 text-xs sm:text-sm">
          Modify existing coupon parameters.
        </DialogDescription>
      </div>
    </div>

    {/* BODY */}
    {editingCoupon && (
      <div className="p-4 sm:p-6 md:p-8 space-y-5 bg-slate-50/50">

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              Coupon Code
            </label>
            <Input
              value={editingCoupon.code}
              disabled
              className="h-11 sm:h-12 rounded-xl opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              Discount Type
            </label>
            <Select
              value={editingCoupon.discount_type}
              onValueChange={(val: any) =>
                setEditingCoupon({ ...editingCoupon, discount_type: val })
              }
            >
              <SelectTrigger className="h-11 sm:h-12 rounded-xl w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              Value
            </label>
            <Input
              value={editingCoupon.discount_value}
              onChange={(e) =>
                setEditingCoupon({
                  ...editingCoupon,
                  discount_value: Number(e.target.value),
                })
              }
              className="h-11 sm:h-12 rounded-xl w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              Min Order
            </label>
            <Input
              value={editingCoupon.min_order_value}
              onChange={(e) =>
                setEditingCoupon({
                  ...editingCoupon,
                  min_order_value: Number(e.target.value),
                })
              }
              className="h-11 sm:h-12 rounded-xl w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              Status
            </label>
            <Select
              value={editingCoupon.status}
              onValueChange={(val: any) =>
                setEditingCoupon({ ...editingCoupon, status: val })
              }
            >
              <SelectTrigger className="h-11 sm:h-12 rounded-xl w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* CRITICAL SECTION */}
        <div className="bg-[#fffbeb]/60 p-4 rounded-2xl border border-amber-200">

          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase mb-3">
            <AlertCircle size={14} /> Critical Dates
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-amber-600">
                EXPIRY DATE
              </label>
              <Input
                type="datetime-local"
                value={format(
                  new Date(editingCoupon.expiry_date),
                  "yyyy-MM-dd'T'HH:mm"
                )}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    expiry_date: e.target.value,
                  })
                }
                className="h-10 rounded-lg border-amber-200 w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-amber-600">
                USAGE LIMIT
              </label>
              <Input
                type="number"
                value={editingCoupon.usage_limit_total || ""}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    usage_limit_total: Number(e.target.value),
                  })
                }
                className="h-10 rounded-lg border-amber-200 w-full"
              />
            </div>

          </div>
        </div>
      </div>
    )}

    {/* FOOTER */}
    <DialogFooter className="p-4 sm:p-6 md:p-8 bg-white border-t flex flex-col sm:flex-row gap-3 sm:gap-4">

      <Button
        variant="ghost"
        onClick={() => setIsEditPopUpOpen(false)}
        className="w-full sm:w-auto rounded-xl h-11 sm:h-12 px-6"
      >
        Cancel
      </Button>

      <Button
        onClick={handleUpdateSubmit}
        disabled={updateMutation.isPending}
        className="w-full sm:w-auto rounded-xl h-11 sm:h-12 px-8 bg-black hover:bg-slate-800 text-white font-bold"
      >
        {updateMutation.isPending ? "Updating..." : "Update Coupon"}
      </Button>

    </DialogFooter>

  </DialogContent>
</Dialog>
      <Dialog open={isUsageModalOpen} onOpenChange={setIsUsageModalOpen}>
        <DialogContent className="sm:max-w-[750px] rounded-3xl p-0 overflow-hidden h-[80vh] flex flex-col">
          <div className="p-6 bg-[#96723b] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users size={24} />
              <div>
                <DialogTitle className="text-2xl font-black italic">
                  USAGE TRACKING
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  Detailed history for {selectedCouponForUsage?.code}
                </DialogDescription>
              </div>
            </div>
            {selectedCouponForUsage && (
              <Badge className="bg-white/20 text-white border-white/30 text-lg py-1 px-4">
                Total Uses: {selectedCouponForUsage.used_count}
              </Badge>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {isUsageLoading ? (
                <div className="flex items-center justify-center p-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : usageData.length > 0 ? (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Order Info</TableHead>
                        <TableHead>Saved</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageData.map((usage) => (
                        <TableRow key={usage.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold">
                                {usage.user_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {usage.user_email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-mono text-xs">
                                #{usage.order_id}
                              </span>
                              <Badge
                                variant="outline"
                                className="w-fit text-[10px] mt-1"
                              >
                                ₹{usage.order_total}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-emerald-600 font-bold">
                              -₹{usage.discount_amount}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">
                            {format(new Date(usage.used_at), "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <ShoppingBag
                                size={14}
                                className="text-indigo-600"
                              />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-20 opacity-30 gap-4">
                  <ShoppingBag size={64} />
                  <p className="text-xl font-bold italic uppercase">
                    No orders used this coupon yet
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
