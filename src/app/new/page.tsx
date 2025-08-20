'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api, { endpoints } from '@/lib/api';
import CompanyForm from '@/components/CompanyForm';
import { Product } from '@/lib/zodSchemas';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: Product) => {
    try {
      await api.post(endpoints.products, data);
      toast.success('Company created successfully');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create company');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Add New Company</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <CompanyForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
}
