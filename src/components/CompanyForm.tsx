'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { productSchema, Product } from '@/lib/zodSchemas';
import TagsInput from './TagsInput';

interface CompanyFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Product) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CompanyForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      boycott: initialData?.boycott || false,
      reason: initialData?.reason || '',
      alternatives: initialData?.alternatives || [],
      barcodes: initialData?.barcodes || [],
      proofUrls: initialData?.proofUrls || [],
    },
  });

  const boycott = watch('boycott');

  const handleFormSubmit = async (data: Product) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <Label htmlFor="name">Company Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter company name"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Boycott Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="boycott"
          checked={boycott}
          onCheckedChange={(checked) => setValue('boycott', checked)}
        />
        <Label htmlFor="boycott">Boycott this company</Label>
      </div>

      {/* Reason Field */}
      <div>
        <Label htmlFor="reason">Reason *</Label>
        <Textarea
          id="reason"
          {...register('reason')}
          placeholder="Explain why this company should be boycotted or is safe"
          rows={4}
          className={errors.reason ? 'border-red-500' : ''}
        />
        {errors.reason && (
          <p className="text-sm text-red-500 mt-1">{errors.reason.message}</p>
        )}
      </div>

      {/* Alternatives */}
      <div>
        <Label>Alternative Companies</Label>
        <TagsInput
          value={watch('alternatives')}
          onChange={(alternatives) => setValue('alternatives', alternatives)}
          placeholder="Add alternative companies"
        />
      </div>

      {/* Barcodes */}
      <div>
        <Label>Barcodes</Label>
        <TagsInput
          value={watch('barcodes')}
          onChange={(barcodes) => setValue('barcodes', barcodes)}
          placeholder="Add barcodes (digits only)"
          normalize={(value) => value.replace(/[^\d]/g, '')}
        />
      </div>

      {/* Proof URLs */}
      <div>
        <Label>Proof URLs</Label>
        <TagsInput
          value={watch('proofUrls')}
          onChange={(proofUrls) => setValue('proofUrls', proofUrls)}
          placeholder="Add proof URLs"
          normalize={(value) => {
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
              return `https://${value}`;
            }
            return value;
          }}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
