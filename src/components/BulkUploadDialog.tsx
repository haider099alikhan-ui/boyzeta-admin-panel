'use client';

import { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api, { endpoints } from '@/lib/api';
import { csvRowSchema, CsvRow } from '@/lib/zodSchemas';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface UploadResult {
  row: CsvRow;
  success: boolean;
  error?: string;
}

export default function BulkUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: BulkUploadDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);

  const parseCSV = (csvText: string): CsvRow[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });
      
      return row;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsed = parseCSV(csvText);
      
      // Validate each row
      const validated: CsvRow[] = [];
      const errors: string[] = [];
      
      parsed.forEach((row, index) => {
        try {
          const validatedRow = csvRowSchema.parse(row);
          validated.push(validatedRow);
        } catch (error: any) {
          errors.push(`Row ${index + 2}: ${error.message}`);
        }
      });
      
      if (errors.length > 0) {
        toast.error(`Validation errors:\n${errors.join('\n')}`);
        return;
      }
      
      setParsedData(validated);
      toast.success(`Parsed ${validated.length} rows successfully`);
    };
    
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) return;
    
    setUploading(true);
    const uploadResults: UploadResult[] = [];
    
    for (const row of parsedData) {
      try {
        await api.post(endpoints.products, {
          name: row.name,
          boycott: row.boycott,
          reason: row.reason,
          alternatives: row.alternatives,
          barcodes: row.barcodes,
          proofUrls: row.urls,
        });
        
        uploadResults.push({ row, success: true });
      } catch (error: any) {
        uploadResults.push({
          row,
          success: false,
          error: error.response?.data?.message || error.message,
        });
      }
    }
    
    setResults(uploadResults);
    setUploading(false);
    
    const successCount = uploadResults.filter(r => r.success).length;
    const errorCount = uploadResults.filter(r => !r.success).length;
    
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} products`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} products`);
    }
    
    if (successCount > 0) {
      onSuccess();
    }
  };

  const reset = () => {
    setParsedData([]);
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Companies</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload */}
          {parsedData.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Button variant="outline">
                    Choose CSV File
                  </Button>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                CSV should have columns: name, boycott, reason, alternatives, barcodes, urls
              </p>
            </div>
          )}
          
          {/* Preview Table */}
          {parsedData.length > 0 && results.length === 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Preview ({parsedData.length} rows)</h3>
                <div className="space-x-2">
                  <Button variant="outline" onClick={reset}>
                    <X className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload All'}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Alternatives</TableHead>
                      <TableHead>Barcodes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>
                          <Badge variant={row.boycott ? "destructive" : "default"}>
                            {row.boycott ? "Boycott" : "Safe"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{row.reason}</TableCell>
                        <TableCell>{row.alternatives.length}</TableCell>
                        <TableCell>{row.barcodes.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsedData.length > 10 && (
                  <div className="p-4 text-center text-sm text-gray-600">
                    Showing first 10 rows of {parsedData.length} total
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Results Table */}
          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Upload Results</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.row.name}</TableCell>
                        <TableCell>
                          {result.success ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-red-600">
                          {result.error}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
