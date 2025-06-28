'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { addProductAction, updateProductAction, deleteProductAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  availableQuantity: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer'),
  imageHint: z.string().optional(),
  isVisible: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface InventoryActionsProps {
  mode: 'add' | 'edit';
  product?: Product;
}

export function InventoryActions({ mode, product }: InventoryActionsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues:
      mode === 'edit' && product
        ? {
            name: product.name,
            description: product.description,
            price: product.price,
            availableQuantity: product.availableQuantity,
            imageHint: product.imageHint,
            isVisible: product.isVisible,
          }
        : {
            name: '',
            description: '',
            price: 0,
            availableQuantity: 0,
            imageHint: '',
            isVisible: true,
          },
  });

  const onSubmit = (values: ProductFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      // Manually handle boolean for FormData
      const { isVisible, ...otherValues } = values;
      
      Object.entries(otherValues).forEach(([key, value]) => {
          formData.append(key, String(value));
      });
      
      // The switch sends "on" when checked, which is what we need for the server action.
      // If it's not checked, we don't append it, and the server action will use the default.
      if (isVisible) {
          formData.append('isVisible', 'on');
      }

      const result =
        mode === 'add'
          ? await addProductAction(formData)
          : await updateProductAction(product!.id, formData);
      
      if (result?.success) {
        toast({ title: 'Success', description: result.success });
        setIsFormOpen(false);
        form.reset(
          mode === 'add' ? { isVisible: true, name: '', description: '', price: 0, availableQuantity: 0, imageHint: '' } : undefined
        );
      } else {
        toast({ title: 'Error', description: "An unexpected error occurred.", variant: 'destructive' });
      }
    });
  };
  
  const handleDelete = () => {
    startTransition(async () => {
        if (!product) return;
        const result = await deleteProductAction(product.id);
        if (result?.success) {
            toast({ title: 'Success', description: result.success });
        } else {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        }
    });
  }

  if (mode === 'add') {
    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the details for the new product.</DialogDescription>
          </DialogHeader>
          <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...form.register('name')} />
               {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register('description')} />
              {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" {...form.register('price')} />
                {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                <Label htmlFor="availableQuantity">Quantity</Label>
                <Input id="availableQuantity" type="number" {...form.register('availableQuantity')} />
                 {form.formState.errors.availableQuantity && <p className="text-sm text-destructive">{form.formState.errors.availableQuantity.message}</p>}
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="imageHint">Image Hint</Label>
              <Input id="imageHint" {...form.register('imageHint')} placeholder="e.g. blue shirt"/>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 mt-2">
              <div className="space-y-0.5">
                  <Label htmlFor="isVisible">Product Visibility</Label>
                  <p className="text-xs text-muted-foreground">
                      Show this product on your storefront.
                  </p>
              </div>
              <Switch
                  id="isVisible"
                  {...form.register('isVisible')}
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button type="submit" form="product-form" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsFormOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                         <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product
                    "{product?.name}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                    {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details for "{product?.name}".</DialogDescription>
            </DialogHeader>
            <form id="product-edit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="name-edit">Product Name</Label>
                    <Input id="name-edit" {...form.register('name')} />
                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description-edit">Description</Label>
                    <Textarea id="description-edit" {...form.register('description')} />
                    {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="price-edit">Price</Label>
                    <Input id="price-edit" type="number" step="0.01" {...form.register('price')} />
                     {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="availableQuantity-edit">Quantity</Label>
                    <Input id="availableQuantity-edit" type="number" {...form.register('availableQuantity')} />
                     {form.formState.errors.availableQuantity && <p className="text-sm text-destructive">{form.formState.errors.availableQuantity.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="imageHint-edit">Image Hint</Label>
                    <Input id="imageHint-edit" {...form.register('imageHint')} placeholder="e.g. blue shirt"/>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 mt-2">
                    <div className="space-y-0.5">
                        <Label htmlFor="isVisible-edit">Product Visibility</Label>
                        <p className="text-xs text-muted-foreground">
                            Show this product on your storefront.
                        </p>
                    </div>
                    <Switch
                        id="isVisible-edit"
                        {...form.register('isVisible')}
                    />
                </div>
            </form>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit" form="product-edit-form" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
